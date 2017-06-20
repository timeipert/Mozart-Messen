#!/usr/bin/python
from music21 import *
from os import listdir
from os.path import isfile, join
import re

class nGram(object):
    def __init__(self,musicStream,n):
        print("nGram created")
        self.parent = ""
        self.gramtype = 'rel_pitch'
        self.n = int(n)
        self.nGramList = dict()
        self.fullStream = musicStream
        #Bildet nGramliste des Objekts

    def exec(self):
        print("Search for nGrams")
        nGramCollect = {}
        noteIterator = 0

        exitNumber = len(self.fullStream) - self.n
        for iteratedNote in self.fullStream:

            nGramObject = {}
            singleNgram = self.__get_chromatic_ngram(self.fullStream, noteIterator)

            if singleNgram == 0:
                print("continue "+str(singleNgram)+"... "+iteratedNote)
                continue
            singleNgram[1]["parent"] = self.parent
            if singleNgram[0] not in nGramCollect:
                nGramObject["value"] = 1

                nGramObject["position"] = [singleNgram[1]]

                nGramObject["start-pitch"] = singleNgram[2]
                nGramCollect[singleNgram[0]] = nGramObject
            else:
                nGramCollect[singleNgram[0]]["value"] += 1
                nGramCollect[singleNgram[0]]["position"].append(singleNgram[1])

            if noteIterator == exitNumber:
                break
            noteIterator += 1

        self.nGramList = nGramCollect

    def push(self,extnGram):
        print("push nGramList")
        for item in extnGram:
            if item in self.nGramList:
                self.nGramList[item]["value"] += extnGram[item]["value"]
                self.nGramList[item]["position"].extend(extnGram[item]["position"])
            else:
                self.nGramList[item] = extnGram[item]

    #  Gibt Intervall und Position von zwei Noten im Stream aus
    def __get_chromatic_ngram(self, fullStream, noteIterator):
        nGramPositions = {}
        chromaticString = ""
        firstNote = fullStream[noteIterator]
        nGramPositions["start-measure"] = firstNote.measureNumber
        for i in range(0, self.n - 1):


            endNoteIt = noteIterator + i+1
            if endNoteIt >= len(fullStream):

                print("end:" + str(endNoteIt) + "len:" + str(len(fullStream)))
                continue
            else:
                endNote = fullStream[endNoteIt]
            startNote = fullStream[noteIterator + i]



            nGramPositions["end-measure"] = endNote.measureNumber
            if i == self.n - 2:
                chromaticString += str(interval.notesToChromatic(startNote, endNote).semitones)
            else:
                inter = interval.notesToChromatic(startNote, endNote)
                semit = inter.semitones
                if semit == 0:
                    semitstr = '0'
                else:
                    semitstr = str(semit)
                chromaticString += semitstr
                chromaticString += "|"

        return [chromaticString, nGramPositions, firstNote.name]

class MassMov(object):
    def __init__(self):
        self._completeStream = None
        self._flattedStream = list()
        self.nGrams = dict()
        self.nGramMinValue = 0
        self.movementType = ""
        self.movementTypeShort = ""
        self.movementMeasures = 0
        self._tidylog = ""

    def parse_stream(self,uri,clearname):
        self._completeStream = converter.parse(uri)
        abbr = {"Agnus Dei": "ad", "Kyrie": "k", "Credo": "c", "Benedictus": "b", "Gloria": "g", "Sanctus": "s"}
        self.movementType = clearname
        self.movementTypeShort = abbr[clearname]
        self.movementMeasures = len(self._completeStream.getElementsByClass("Stream")[0].getElementsByClass(stream.Measure))

        print("Parse "+self.movementType)
        print("Measures:" + str(self.movementMeasures))


    def flat_stream(self):
        print("Flat Stream")
        outputNotes = list()
        counter = 1
        for innerStreams in self._completeStream.getElementsByClass("Stream"):
            flattedNotes = []
            for innerInnerNoteStream in self._completeStream[counter].flat.getElementsByClass("Note"):
                flattedNotes.append(innerInnerNoteStream)
            outputNotes.append(flattedNotes)
            flattedNotes = None
            counter += 1
        self._flattedStream = outputNotes

    def build_ngram_data(self, n, mis):
        print("build ngram data of Mov for n = ", n)
        outputnGram = nGram(self._flattedStream,n)

        for singleStream in self._flattedStream:
            nGramObject = nGram(singleStream,n)
            nGramObject.parent = self.movementTypeShort
            nGramObject.exec()
            outputnGram.push(nGramObject.nGramList)
        self.nGrams[n] = outputnGram.nGramList

    def tidy_ngrams(self):
        #
        #   Entfernt nGramme, die unter die vorgegebene Anzahl fallen oder die die falsche n-Größe haben
        #
        countElements = 0
        counter = [0,0,0]
        print("tidy mov...")
        nGramsClone = dict()
        for nn in self.nGrams:
            countElements += len(self.nGrams[nn])
            print("N:", nn)
            nGramClone = dict(self.nGrams[nn])
            for nGramElement in self.nGrams[nn]:
                #print(nGramElement)
                if nGramElement.count('|') + 2 < nn:
                    #print("too short nGramElement: ",nGramElement.count('|') + 2, nn)
                    counter[0] += 1
                    del nGramClone[nGramElement]

                elif nGramClone[nGramElement]["value"] <= self.nGramMinValue:
                    counter[1] += 1
                    #print("nGramMinValue nGramElement: ",nGramClone[nGramElement]["value"],self.nGramMinValue )
                    if nGramElement in nGramClone:
                        del nGramClone[nGramElement]
            if "" in self.nGrams[nn]:
                counter[2] += 1
                print("" in self.nGrams[nn])
                #del nGramClone[""]
            nGramsClone[nn] = nGramClone
        self.nGrams = nGramsClone
        self._tidylog = "nGramMinValue:" + str(self.nGramMinValue)+"-BElements:"+str(countElements)+"-DelElements:"+str(counter[0])+","+str(counter[1])+","+str(counter[2])
        print(self._tidylog)

    def _to_table(self,nGramObject,mis,mov,n):
        print("To Table..."+mov)
        output = "<!--HEADER|"+mis+"|"+mov+"|"+n+"|"+str(self.movementMeasures)+"|"+self._tidylog+"-->"
        output += "<table>"
        output += "<thead><tr><td>nGramm</td><td>H&auml;ufigkeit</td><td>Positionen</td></tr></thead><tbody>"

        for ngramcounter in nGramObject:
            output += "<tr><td>"+nGramObject[ngramcounter]['start-pitch']+": " + ngramcounter + "</td><td>" + str(nGramObject[ngramcounter]['value']) + "</td><td><ul>"

            for pos in nGramObject[ngramcounter]["position"]:
                output += "<li>" + str(pos["start-measure"]) + ":" + str(pos["end-measure"]) + "</li>"
            output += "</ul></td></tr>"
        output += "</tbody></table>"
        return output

    def save(self, path, missaname):
        print("MassMov.save(" + self.movementType+")")

        for n in self.nGrams:
            print("MassMov.save .." + str(n))

            filename = self.movementTypeShort + str(n) + '.html'
            movementstring = self._to_table(self.nGrams[n],missaname,self.movementType,str(n))
            with open(path+filename, "w") as f:
                f.write(str(movementstring))
                print("Successfull written", f)

class Mass(object):
    def __init__(self, reffolder):
        self._massMovements = {}
        self._refFolder = reffolder
        self._nGramList = (4,15)
        self._nGramMinValue = 2
        self._filesInDir = []
        self._massnGrams = {}
        missaNameGroup = re.findall(r'([\w\s]+)\/',reffolder)
        self._missaName = missaNameGroup[len(missaNameGroup)-1]

    def attr(self, setdict):
        #
        #   Setter
        #
        self._nGramList = setdict["ngrams"]
        self._nGramMinValue = setdict["ngram-min-value"]

    def build(self):
        #
        #   Exec-Function für Klasse Mass:
        #   Sammelt Dateien im Werkordner, führt pro Datei _build_mov() aus
        #   Führt save() aus.
        #
        print("Build Mass... Mass.build()")
        self._filesInDir = [f for f in listdir(self._refFolder) if isfile(join(self._refFolder, f))]
        for file in self._filesInDir:
            print(file)
            fileNameGroup = re.match(r'([\w\s]+)\.xml',file, re.I)
            if fileNameGroup:
                fileName = fileNameGroup.group(1)
                print("build_mov:", fileName)
                self._massMovements[fileName] = self._build_mov(self._refFolder + file, fileName)
                self.save(self._refFolder + "ngram/", fileName)


    def _build_mov(self, movPath, fileName):
        #
        #   Erstellt eine nGram-Sammlung für einen bestimmten Satz.
        #   Output: Dict
        #   {n: {ngramstring: {position, start-pitch, value}}}
        #
        SpecificMovement = MassMov()
        SpecificMovement.parse_stream(movPath,fileName)
        SpecificMovement.flat_stream()
        for n in self._nGramList:
            SpecificMovement.build_ngram_data(n,self._missaName)
        SpecificMovement.nGramMinValue = self._nGramMinValue

        SpecificMovement.tidy_ngrams()

        print("mov:")
        print(SpecificMovement)
        return SpecificMovement

    def save(self, path, fileName):
        #
        # Pipeline zu MassMov.save()
        #
        print("Save Massmovement (Mass) ->... Mass.save()")
        if self._massMovements == {}:
            print("Keine Daten")
            return
        self._massMovements[fileName].save(path,self._missaName)

    def _to_table(self,nGramObject,mis,mov,n):
        #
        #   Erstellt Datenstring für html-Datei aus Dict
        #
        print("To Table Mass...")
        highestPosition = 100
        output = "<table>"
        output += "<thead><tr><td>nGramm</td><td>H&auml;ufigkeit</td><td>Positionen</td></tr></thead><tbody>"
        for nGram in nGramObject:

            output += "<tr><td>"+nGramObject[nGram]['start-pitch']+": " + nGram + "</td><td>" + str(nGramObject[nGram]['value']) + "</td><td><ul>"

            for pos in nGramObject[nGram]["position"]:
                output += "<li>" + str(pos["start-measure"]) + ":" + str(pos["end-measure"]) + " ("+pos["parent"]+")</li>"
                if pos["start-measure"] > highestPosition:
                    highestPosition = pos["start-measure"]
                elif pos["end-measure"] > highestPosition:
                    highestPosition = pos["end-measure"]
            output += "</ul></td></tr>"
        output += "</tbody></table>"
        boutput = "<!--HEADER|" + mis + "|" + mov + "|" + str(n) + "|"+str(highestPosition)+"|-->"+output
        return boutput

    def flat_mass_ngram(self):
        #
        # Erstellt messenübergreifende Daten
        #
        for move in self._massMovements:
            for n in self._massMovements[move].nGrams:
                if n in self._massnGrams:
                    self._massnGrams[n].push(self._massMovements[move].nGrams[n])
                else:
                    self._massnGrams[n] = nGram(None,n)
                    self._massnGrams[n].push(self._massMovements[move].nGrams[n])
        self.saveMass(self._refFolder+"ngram/")

    def saveMass(self, path):
        #
        #   Speichert messenübergreifende Daten
        #
        print("Save Massdata")
        for n in self._massnGrams:
            filename = "m"+ str(n) + '.html'
            movementstring = self._to_table(self._massnGrams[n].nGramList,self._missaName,"Full",str(n))
            with open(path+filename, "w") as f:
                f.write(str(movementstring))
                print("Successfull written", f)

for i in range(1,9):
    Missa = Mass("missa"+str(i)+"/")
    Missa.build()
    Missa.flat_mass_ngram()



test = '''
s = converter.parse('tinyNotation: 4/4 c4 d e e c d e e c d f e ')
t = converter.parse('tinyNotation: 4/4 d4 e f# f# c d e e f d f g ')

n = nGram(s.flat.getElementsByClass(note.Note), 4)
nt = nGram(t.flat.getElementsByClass(note.Note), 4)
n.exec()
nt.exec()
print(n.nGramList)
print(nt.nGramList)
n.push(nt.nGramList)

print(n.nGramList)
'''