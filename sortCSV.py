import csv
import re
import operator

sample = open('taxidata_sortedbytime2.csv', 'r')

csv1 = csv.reader(sample,delimiter=',')

sort = sorted(csv1, key=operator.itemgetter(1))

file = open('taxidata_sorted.csv', 'w')

file.write('"id","date","x_coord","y_coord","hired"\n')


for eachline in sort:
	new_str = re.sub('[\[\]\']',"", str(eachline))
	new_str = re.sub(', 2013', ",\"2013", new_str)

	new_str = re.sub(', 19.', "\",19.", new_str)
	new_str = re.sub(', 18.', "\",18.", new_str)
	new_str = re.sub(', 17.', "\",17.", new_str)
	new_str = re.sub(', 16.', "\",16.", new_str)

	new_str = re.sub(', 58.', ",58.", new_str)
	new_str = re.sub(', 59.', ",59.", new_str)
	new_str = re.sub(', 60.', ",60.", new_str)

	new_str = re.sub(', t', ",1", new_str)
	new_str = re.sub(', f', ",0", new_str)
	file.write(new_str + '\n')


file.close()