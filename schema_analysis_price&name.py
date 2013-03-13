#!/usr/local/bin python
#coding=utf-8

import urllib2
import lxml.etree as etree
import httplib
import urlparse

# html = '''
# <html>
# 　　<head>
# 　　</head>
# 　　<body>
# 　　　　<h1 class="heading">Top News</h1>
# 　　　　<p style="font-size: 200%">World News only on this page</p>
# 　　　　Ah, and here's some more text, by the way.
# 　　　　<p>... and this is a parsed fragment ...</p>
# 		<div class="price hilight" itemprop="price" data-bntrack="Price" data-bntrack-event="click">$19.99</div>
#         <div class="price-info">
# 　　</body>
# </html>
# '''



def is_url_available(url):
	host, path = urlparse.urlsplit(url)[1:3]
	found = 0
	try:
		connection = httplib.HTTPConnection(host)  ## Make HTTPConnection Object
		connection.request("HEAD", path)
		responseOb = connection.getresponse()      ## Grab HTTPResponse Object

		if responseOb.status == 200:
			found = 1
		else:
			print "Status %d %s : %s" % (responseOb.status, responseOb.reason, url)
	except Exception, e:
		print e.__class__,  e, url
	return found



def is_url_schema(url):

	flag = urlreader(url).xpath('//*[@itemprop="name"]')

	result = 1

	if (flag == []):
		result = 0

	return result



def urlreader(url):
	page_html = urllib2.urlopen(url).read()
	page = etree.HTML(page_html.lower().decode('utf-8'))
	return page


def get_product_price(url):
	
	prices = urlreader(url).xpath('//*[@itemprop="price"]')
	price = prices[0]

	return price.text



def get_product_name(url):

	names = urlreader(url).xpath('//*[@itemprop ="name"]')

	name = names[0]

	return name.text






# check if the url is a schema style
# def if_schema_page(url):
# 	pass

# get the domain name of a url
# def get_domain_name():
# 	pass

# connect to the database and get 
# def load_dbconnected_profile(domain_name):
#     content = {}

#     root = minidom.parse(<span style="background-color: rgb(255, 255, 255); ">domain_name</span>)
#     table = root.getElementsByTagName("table")[0]∫

#   #read dbname and table name.
#     table_name = table.getAttribute("name")
#     db_name = table.getAttribute("db_name")

#     if len(table_name) > 0 and len(db_name) > 0:
#      db_sql = "create database if not exists `" + db_name +"`; use " + db_name + ";" 
#      table_drop_sql = "drop " + table_name + " if exists " + table_name + ";" 
#      content.update({"db_sql" : db_sql})
#      content.update({"table_sql" : table_drop_sql })
#   else:
#      print "Error:attribute is not define well!  db_name=" + db_name + " ;table_name=" + table_name
#      sys.exit(1)


if __name__ == '__main__':
	urls = [
	'http://www.barnesandnoble.com/p/home-gift-ihome-ihm60-20-rechargable-mini-speaker-gray/25547311?ean=47532896213&isbn=47532896213&urlkeywords=ihome+ihm60+20+rechargable+mini+speaker+gray',
	'http://www.barnesandnoble.com/p/toys-games-kiss-8-gb-usb-flash-drive-peter-criss-catman/25209496?ean=895221380051&isbn=895221380051',
	'http://www.bbq.com/item_name_Kamado-Joe-ClassicJoe-Ceramic-Kamado-Grill-On-Cart-Red_path_2112-11447_item_2854890',
	'http://www.barnesandnoble.com/p/home-gift-ihome-colortunes-noise-isolating-headphones-black/25210773?ean=47532897302&isbn=47532897302',
	'http://www.manufactum.com/maplewood-foldable-wardrobe-p1465202/'
	'http://www.barnesandnoble.com/p/home-gift-ihome-ib40b-over-the-ear-headphones-with-volume-control-black/22201677?ean=47532895629&isbn=47532895629',
	'http://www.barnesandnoble.com/p/home-gift-portable-stereo-speaker-system-in-black/25550011?ean=47532895520&isbn=47532895520123123123',
	'http://www.manufactum.com/devold-nansen-troyer-style-pullover-p1465134/',
	'http://www.barnesandnoble.com/p/elan-passport-wallet-for-iphone-4-in-platinum-with-lanyard/25218472?ean=685387307999&isbn=685387307999',
	'http://www.barnesandnoble.com/p/home-gift-bookbook-case-for-iphone-4-4s-classic-black/25390388?ean=851522002429&isbn=851522002429',
	'http://www.barnesandnoble.com/p/urbanears-plattan-on-ear-stereo-headphones-tomato/22221326?ean=7340055303408&isbn=7340055303408',
	'http://www.manufactum.com/petromax-high-powered-lamp-p1465208/',
	'http://www.barnesandnoble.com/p/urbanears-medis-in-ear-stereo-headphones-forest/25236999?ean=7340055306850&isbn=7340055306850',
	'http://www.barnesandnoble.com/p/home-gift-urbanears-bagis-in-ear-stereo-headphones-dark-grey/25211718?ean=7340055303569&isbn=7340055303569',
	'http://www.barnesandnoble.com/p/home-gift-wire-bound-sketch-book-with-paintbrush-icons/12602044?ean=9780641545948',
	'http://www.jcrew.com/womens_category/shorts/novelty/PRDOVR~57806/5780612312312313',
	'http://www.barnesandnoble.com/p/home-gift-ihome-idm3sc-20-speaker-dock-system-for-ipad-iphone-ipod-silver/25381332?ean=47532896374',
	'http://www.barnesandnoble.com/p/home-gift-urbanears-bagis-in-ear-stereo-headphones-white/22221327?ean=7340055303538',
	'http://www.manufactum.com/petromax-high-powered-lamp-p1465208/'
	]


	# outfile = open(‘schemaPrices.txt’, ‘w’)
	for url in urls:
		if is_url_available(url):
			if is_url_schema(url):
				print (get_product_name(url) + " is " + get_product_price(url))
				# print get_product_price(url)
				print " "
			else:
				print ("***"+url+"***  ")
				print "This is not a Schema type website!"
				print " "
		else:
			print "URL not exists"
			print " "
		
		



	# outfile.close()
