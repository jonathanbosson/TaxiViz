import csv
import re
import operator

sample = open('taxidata_sortedbytime.csv', 'r')

csv1 = csv.reader(sample,delimiter=',')

sort = sorted(csv1, key=operator.itemgetter(0))

file = open('taxidata_preprocess.csv', 'w')

file.write('"id","date","x_coord","y_coord"\n')

lastLine = ",0"


for eachline in sort:
	new_str = re.sub('[\[\]\']',"", str(eachline))		
	new_str = re.sub(', 0', ",0", new_str)


	if ",0" in lastLine and ",0" not in new_str:
		new_str = re.sub(', 2013', ",\"2013", new_str)

		new_str = re.sub(', 19.', "\",19.", new_str)
		new_str = re.sub(', 18.', "\",18.", new_str)
		new_str = re.sub(', 17.', "\",17.", new_str)
		new_str = re.sub(', 16.', "\",16.", new_str)

		new_str = re.sub(', 58.', ",58.", new_str)
		new_str = re.sub(', 59.', ",59.", new_str)
		new_str = re.sub(', 60.', ",60.", new_str)

		new_str = re.sub(', 1', "", new_str)

		file.write(new_str + '\n')
	lastLine = new_str


file.close()