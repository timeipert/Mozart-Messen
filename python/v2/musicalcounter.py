import glob, re
import copy
from music21 import *
# Gibt Array mit den gefundenen Messen weiter: {Messenordner: [Messendatei-Satz1, Messendatei-Satz2, ...]}


class Counter(object):
    def __init__(self):
        self.allEl = 0
        self.dataString = ""
        self.backgroundColor = [
    "",
    "rgba(0,0,200,0.4)",
    "rgba(200,150,20,0.4)",
    "rgba(0,192,0,0.4)",
    "rgba(0,0,0,0.4)",
    "rgba(75,192,192,0.4)",
    "rgba(200,0,0,0.4)"
]
        self.dirname = "./anderes/"
        self.Missae = {}
        self.fulllog = {}
        self.labels = ["A-","A","A#","B-","B","B#","C-","C","C#","D-","D","D#","E-","E","E#","F","F#","G","G#"]
        self.data = {}

    def get_all_mfiles(self,dirname):
        objects = glob.glob(dirname + "/missa*")
        objects.sort()
        for objectname in objects:
            self.Missae[objectname] = []
            objects = glob.glob(objectname + "/*.xml")
            objects.sort()
            for objectnames in objects:
                self.Missae[objectname].append(objectnames)
        self.fulllog = self.Missae.copy()
        self.filter_missae()

    def filter_missae(self):
        logfile = str(open(self.dirname + "countdata.log").readlines())
        M = self.Missae.copy()
        for searchword in M:
            if re.search(searchword, logfile):
                del(self.Missae[searchword])


    def count_notes_of_file(self,c,file):
        temp = {}
        temp2 = {}
        for cnote in c.flat.getElementsByClass(note.Note):
            if cnote.name in temp:
                temp[cnote.name] += 1
            else:
                temp[cnote.name] = 0
        #print_chart(temp)
        print("Anzahl: ",len(c.flat.getElementsByClass(note.Note)))
        self.allEl += len(c.flat.getElementsByClass(note.Note))
        for n in temp:
            temp2[n] = temp[n]/len(c.flat.getElementsByClass(note.Note))
            temp2[n] = round(temp2[n]*1000,2)
        return [ temp2, len(c.flat.getElementsByClass(note.Note)) ]

    def generate_data(self):
        for Missa in self.Missae:
            self.data[Missa] = {}
            for Mov in self.Missae[Missa]:
                print("Datei: ", Mov)
                c = converter.parse(Mov)
                self.data[Missa][Mov] = self.count_notes_of_file(c, Mov)

    def get_data_string(self):
        reStr = "var data = new Object();"
        a = 0
        # Alle Messen -> c: Key einer Messe complet[c]: Messesätze
        for c in sorted(self.data):
            returnString = self.get_chart_string(self.data[c], c, a)
            reStr += returnString
            a += 1
        self.dataString = reStr

    def get_chart_string(self, MovementTitlePath, MissaTitlePath, Number):

        # Anfang pro Messe
        getMissaName = re.search(self.dirname+"(.*)", MissaTitlePath)
        MissaName = getMissaName.group(1)

        returnString = '''
        data["''' + MissaName + '''"] = {
        labels: ['''
        i = 1
        for t in self.labels:
            if i != len(self.labels):
                returnString += '"'
                returnString += t
                returnString += '",'
            else:
                returnString += '"'
                returnString += t
                returnString += '"'
            i = 1 + i
        returnString += '''],
        datasets: ['''
        k = 1
        for Movement in sorted(MovementTitlePath):
            MovementName = re.search(self.dirname+"(?:.*)\/(.*)\.xml", Movement)
            MovementName = MovementName.group(1)
            returnString += '''{
                label: "''' + MovementName + '''",
                countAll: ''' + str(MovementTitlePath[Movement][1]) + ''',
                backgroundColor: "''' + self.backgroundColor[k] + '''",
                data: ['''
            i = 1
            for Label in self.labels:
                if Label not in MovementTitlePath[Movement][0].keys():
                    MovementTitlePath[Movement][0][Label] = 0
                if i != len(self.labels):

                    returnString += str(MovementTitlePath[Movement][0][Label])
                    returnString += ','
                else:
                    returnString += str(MovementTitlePath[Movement][0][Label])
                i = 1 + i
            returnString += ''' ]
            }'''
            if k != len(MovementTitlePath):
                returnString += ","
            k = k + 1
        returnString += ''']
            };'''
        return returnString

    def save(self):
        f = open('countdata.js', 'w')
        f.write(str(self.dataString))
        f.close()
        print("Datei wurde geschrieben.")
        w = open('countdata.log', 'w')
        w.write(str(self.fulllog)+"\n"+str(self.allEl))
        w.close()
        print("Datei wurde geschrieben.")

m = Counter()
m.get_all_mfiles(m.dirname)
m.generate_data()
m.get_data_string()
m.save()
