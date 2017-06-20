import glob, re, itertools

class Summarize:
    def __init__(self, dirname):
        self.dirname = dirname
        self.ngramlist = [4,15]
        self.Missae = {}
        self.nGramObject = {}
        self.highestPos = 100

    def get_all_mfiles(self):
        objects = glob.glob(self.dirname + "/missa*")
        objects.sort()
        for n in self.ngramlist:
            self.Missae[n] = {}
            for objectname in objects:
                missanamesearch = re.search("\/missa(\d+)",objectname)
                missaname = missanamesearch.group(1)
                self.Missae[n][missaname] = []
                path = objectname + "/ngram/m"+str(n)+".html"
                innerobjects = glob.glob(path)
                innerobjects.sort()
                for objectnames in innerobjects:

                    self.Missae[n][missaname].append(objectnames)
                if len(self.Missae[n][missaname]) == 0:
                    del self.Missae[n][missaname]

    def get_ngram_object(self):
        self.nGramObject = {}
        for n in self.Missae:
            self.nGramObject[n] = {}
            print("N:", str(n))
            for m in self.Missae[n]:
                print("Read File")
                filetext = str(open(self.dirname + str(self.Missae[n][m][0])).readlines())
                print(self.Missae[n][m][0])
                for ngraminput, value, pos in re.findall("<tr><td>([^\/]*?)<\/td><td>(\d+?)<\/td><td><ul>(.*?)<\/ul><\/td><\/tr>",filetext,re.MULTILINE):
                    positions = []
                    ngramsearch = re.search("(\w): (.*)",ngraminput)
                    if ngramsearch == None:
                        continue
                    startpitch = ngramsearch.group(1)
                    ngram = ngramsearch.group(2)
                    for val, valtwo, mov in re.findall("(\d+):(\d+) \((.*?)\)",pos,re.MULTILINE):
                        posob = {}
                        posob["start-measure"] = int(val)
                        posob["end-measure"] = int(valtwo)
                        posob["parent"] = mov+")("+m
                        positions.append(posob)
                        if int(val) > self.highestPos:
                            self.highestPos = int(val)


                    if ngram in self.nGramObject[n]:
                        print(ngram)
                        print("Len nGramObject "+str(n), len(self.nGramObject[n][ngram]["position"]))
                        print(len(positions))
                        self.nGramObject[n][ngram]["value"] = int(value) + int(self.nGramObject[n][ngram]["value"])
                        self.nGramObject[n][ngram]["position"] += positions


                    else:

                        self.nGramObject[n][ngram] = {"value": int(value), "position": positions, "start-pitch": startpitch}


class HtmlSum(Summarize):
    def get_table(self, nGramObject, n):

        #
        #   Erstellt Datenstring für html-Datei aus Dict
        #
        print("To Table Mass...")

        output = "<table>"
        output += "<thead><tr><td>nGramm</td><td>H&auml;ufigkeit</td><td>Positionen</td></tr></thead><tbody>"

        for nGram in nGramObject:
            # print(nGram)
            # print(len(nGramObject))
            # print(len(nGramObject[nGram]["position"]))
            # print(nGramObject[nGram]["value"])
            output += "<tr><td>" + nGramObject[str(nGram)]['start-pitch'] + ": " + str(nGram) + "</td><td>" + str(
                nGramObject[str(nGram)]['value']) + "</td><td><ul>"

            for pos in nGramObject[nGram]["position"]:
                output += "<li>" + str(pos["start-measure"]) + ":" + str(pos["end-measure"]) + " (" + pos[
                    "parent"] + ")</li>"

            output += "</ul></td></tr>"
        output += "</tbody></table>"
        boutput = "<!--HEADER|Alle|Messen|" + str(n) + "|" + str(self.highestPos) + "|-->" + output
        return boutput

    def save(self):
        print("Save Massdata")
        for n in self.ngramlist:
            filename = "complet" + str(n) + '.html'
            movementstring = self.get_table(self.nGramObject[n], n)
            with open(self.dirname + filename, "w") as f:
                f.write(str(movementstring))
                print("Successfull written", f)


class JsonSum(Summarize):

    def filter_to_unique(self, positions):
        movLabels = ["k", "g", "c", "s", "b", "ad"]
        controllist = []
        for p in positions:
            parents = p["parent"].split(")(")
            measure = (p["start-measure"] + p["end-measure"]) / 2
            missa = int(parents[1])-1
            checksum = [str(missa), str(movLabels.index(parents[0])), str(measure)]
            if checksum not in controllist:

                controllist.append([str(missa), str(movLabels.index(parents[0])), str(measure)])
        return controllist

    def get_json(self,ngramArray, n):


        ngramout = []
        for ngram in ngramArray:
            if ngram == "0|0|0|0|0|0|0|0|0|0|0|0|0|0":
                continue
            print(ngram)
            positionsArray = ngramArray[ngram]["position"]
            positionsArrayUnique = self.filter_to_unique(positionsArray)
            comb = itertools.combinations(positionsArrayUnique, 2)
            for c in comb:
                if (c[0][0] > c[1][0]):
                    ob = {"start": c[0], "end": c[1]}
                else:
                    ob = {"start": c[1], "end": c[0]}

                if ob not in ngramout:
                    ngramout.append(ob)

            print(len(ngramout))
        return repr(ngramout)


    def save(self):
        savestring = "var ngram = {"
        print("Save Massdata")
        i = 0
        if i != 0:
            savestring += ","
        savestring += str(15)+": "
        savestring += self.get_json(self.nGramObject[15], 15)
        i+=1
        savestring += "};"
        with open("edges.js", "w") as f:
            f.write(str(savestring))
            print("Successfull written", f)


s = JsonSum("./")
s.get_all_mfiles()

s.get_ngram_object()
#print(s.nGramObject[15])
s.save()


