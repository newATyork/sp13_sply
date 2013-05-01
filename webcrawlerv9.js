var casper = require('casper').create({
   clientScripts: ["includes/jquery.min.js"],

});

var dump = require("utils").dump;
var myurl = casper.cli.get(0);
var myimg_url = casper.cli.get(1);

var countLinks = function(myimgurl) {
   var $myimgs = $('img');
  var get_price= function($img,flag){
var jQuery = $;

function getPathTo(element) {
    if (element.id!=='')
        return 'id("'+element.id+'")';
    if (element===document.body)
        return element.tagName;

    var ix= 0;
    var siblings= element.parentNode.childNodes;
    for (var i= 0; i<siblings.length; i++) {
        var sibling= siblings[i];
        if (sibling===element)
            return getPathTo(element.parentNode)+'/'+element.tagName+'['+(ix+1)+']';
        if (sibling.nodeType===1 && sibling.tagName===element.tagName)
            ix++;
    }
}
//get image xpath;
var xpath_img = getPathTo($img);
if(xpath_img.indexOf("/")>-1){
var tem = xpath_img.spilt("/");
var img_idname = tem[0];
}
else
img_idname = -1;
var currencies = [
'EUR','â‚¬',
'GBP','Â£',
'JPY','Â¥',
'CAD','C$',
'AUD','A$',
'USD','$' // this needs to be last
],
cur_sym_to_abbrv_map = {
'â‚¬':'EUR',
'Â£':'GBP',
'Â¥':'JPY',
'C$':'CAD',
'A$':'AUD',
'$':'USD'

},
currency_string = currencies.join('|').replace(/\$/g,'\\$'),
number_string = "\\d+(?:(?:\\.|,)\\d\\d)?",
money_string = "\\s*?(?:"+currency_string+")?\\s*"+number_string+"\\s*(?:"+currency_string+")?\\s*?",
currency_regex = new RegExp(currency_string),
number_regex = new RegExp(number_string),
money_regex = new RegExp(money_string),
exclude_tags = ['SCRIPT','NOSCRIPT','DEL','STRIKE'],
find_with_regex = function(ancestor, regex_string) {
var n, text,
elements = [],
regex_loose = new RegExp(regex_string, "i"),
regex_exact = new RegExp("^"+regex_string+"$", "i");
walk(ancestor);
return elements;
function walk(element){
if( // exclude if:
!element.childNodes // it has no text
|| exclude_tags.indexOf(element.tagName) != -1 // it's a tag we don't care about
|| element.style.getPropertyValue('text-decoration') == 'line-through' // it a line through the text
|| (window.getComputedStyle(element).width <= 0 && window.getComputedStyle(element).height <= 0) // it's not visible on the page
){
return false;
} else {
var text = jQuery(element).text();
if(!regex_loose.exec(text)){
return false;
} else {
var n = element.childNodes.length;
if(n === 1 && element.childNodes[0].nodeType === 3){
elements.push(element);
return true;
} else if(regex_exact.exec(text)){
elements.push(element);
return true;
} else {
var state = false;
for(var i = 0; i < n; i++){
var child = element.childNodes[i];
if(child.nodeType === 1){
state = walk(child) || state ? true : false;
}
}
if(!state){
elements.push(element);
return true;
} else {
return state;
}
}}}} //End of walk()
}, //end of find_with_regex
find_font_size = function(element){
var n, size, max_size = 0;
return walk(element);
function walk(element)
{
if(!element.childNodes){ // it has no text
return max_size
} else {
var n = element.childNodes.length;
if(n > 0){
if(n === 1 && element.childNodes[0].nodeType === 3){
size = parseInt($(element).css('font-size'), 10);
return Math.max(size, max_size);
} else {
for(var i = 0; i < n; i++){
var child = element.childNodes[i];
if(child.nodeType === 1){
return walk(child);
}
}
}
} else {
return max_size;
}
}
}//end of walk inside of find_font_size
}; // end of find_font_size
jQuery.expr[':'].contains_numbers = function(obj, index, meta, stack){
return number_regex.exec(jQuery(obj).text() || '') != null;
}; // end of definition of :contains_numbers()
var amount = null,
currency = null,
max_amount = 1000,
body_font_size = parseInt(jQuery('body').css('font-size'), 10),
node = false,
distances = [],
prices = [],
$prices = [],
xpath_distances = [],
shared_dom_prices = [],
img_offset = $img.offset(),
img_center = {top: img_offset.top+$img.height()/2, left: img_offset.left+$img.width()/2};
// Check for prices that are within a DOM element shared by the img
node = find_with_regex($img.closest(":contains_numbers"))[0];
if(node)
{
 $prices = jQuery(node, money_string);
 $prices.each(function(){
 var text = jQuery.trim(money_regex.exec(jQuery(this).text())[0]);
  shared_dom_prices.push(text);
  });
}
// Calculate the absolute distance between the img and the price
node = window.document.body;

$prices = jQuery(find_with_regex(node, money_string));
//get each xpath distance between price to the image.

/*
var count=0;
//var length=(xpath_img.length-1);
while(count<($prices.length-1)){
var xpath_price = getPathTo($prices[count]);
if (xpath_price.indexOf("/")>-1){
var idtemp = xpath_price.split("/");
var price_idname = idtemp[0];
}
else 
price_idname = -1;
var i = 0;
var xpath_dis=0;
if (price_idname != -1 && price_idname == img_idname){
while(i<length){
if (xpath_price[i]==xpath_img[i]){
xpath_dis++;
i++;}
else 
break;
}}
else
xpath_dis = -1;
var text = jQuery.trim(money_regex.exec($prices[count].text)[0]);
if (xpath_dis > -1){
xpath_distances.push({
el:$prices[count],
text: text,
xpath_dis : 200-xpath_dis
});}

count++;}
*/
$prices.each(function(){
var $this = jQuery(this),
text = jQuery.trim(money_regex.exec($this.text())[0]),
idtemp,
xpath_dis,
price_idname,
xpath_price = getPathTo($this);
if ((img_idname>-1)&&(xpath_price.indexOf("/")>-1)){
idtemp = xpath_price.split("/");
price_idname = idtemp[0];
var i=0;
if (price_idname == img_idname){
while(i<length){
if (xpath_price[i]==xpath_img[i]){
xpath_dis++;
i++;}
else 
break;
}
}
else
price_idname = -1;
}
if(price_idname>-1){
xpath_distances.push({
el: this,
text: text,
xpath_distance: xpath_price
});
}
});

$prices.each(function(){
var $this = jQuery(this),
text = jQuery.trim(money_regex.exec($this.text())[0]),
offset = $this.offset(),
center = {top: offset.top+$this.height()/2, left: offset.left+$this.width()/2},
diff_top = img_center.top - center.top,
diff_left = img_center.left - center.left; 
distances.push({
el: this,
text: text,
distance: Math.sqrt(diff_top*diff_top+diff_left*diff_left)
});
});
//sort xpath distance
xpath_distances.sort(function(a,b){return a.xpath_dis-b.xpath_dis});
distances.sort(function(a,b){ return a.distance-b.distance; });
$prices.each(function(){
var $this = jQuery(this),
weight = 0,
font_size = find_font_size($this[0]),
text = jQuery.trim(money_regex.exec($this.text())[0]);
// Is near the image
if(shared_dom_prices.indexOf(text) > -1 && flag != true) weight+=6;
if(shared_dom_prices.indexOf(text) > -1 && flag == true) weight+=16;
// Is less than the max amount
if(number_regex.exec(text) < max_amount) weight++;
// Has a currency unit
if(currency_regex.exec(text)) weight+=10;
// Has a . or ,
if(/(\.|,)\d\d/.exec(text)) weight++;
// Is bold
if($this.css('font-weight') == 'bold' && flag != true) weight++;
if($this.css('font-weight') == 'bold' && flag == true) weight--;
// Has strike through
if($this.css('text-decoration') == 'line-through') weight-=10;
// Has a larger font
if(font_size > body_font_size){
weight *= font_size - body_font_size + 1;
} else {
weight -= body_font_size - font_size;
}
// Weighting - add points for the following:
// Is near the image

var i = 0, max = Math.min(distances.length + 1, 5);
while(i < max-1){
if(distances[i].text == text) weight *= (max-i);
i++;
}

// add xpath distance as a factor simliar with visual distance
if(flag == true){
var j = 0, max = Math.min(xpath_distances.length + 1, 5);
while(j < max-1){
if(xpath_distances[j].text == text) weight *=(max-j);
j++;
}
}
prices.push({
el: this,
text: text,
weight: weight
});
});
prices.sort(function(a,b){ return b.weight-a.weight; });
if(prices[0]) amount = number_regex.exec(prices[0].text);
if(amount){
 var i=0, cur;
 amount = amount[0];
 while(!currency){
  cur = currencies[i];
  if(prices[0].text.substr(0, cur.length) == cur || prices[0].text.substr(cur.length*-1) == cur || i == currencies.length-1){
  currency = cur_sym_to_abbrv_map[cur] || cur;
  }
 i++;
 }
}

return({
amount: amount,
currency: currency
});
};

var answers;
var myj = 0;
var width =0;
var height =0;
var pos =0;
var minheight = 0;
var maxheight = 0;
var samecount = 0;
var flag;
if(myimgurl.indexOf('?')>-1){
	var temp = myimgurl.split("?");
	myimgurl = temp[0];}
	
while(myj<($myimgs.length-1))
{
	if($myimgs[myj].src.indexOf('?')>-1){
		var temp = $myimgs[myj].src.split("?");
		$myimgs[myj].src = temp[0];
	}
	if (myimgurl.indexOf($myimgs[myj].src)>-1){
		width = $myimgs[myj].width;
		height = $myimgs[myj].height;
		minheight = height*0.95;
		maxheight = height*1.05;
		pos = myj;
		break;
	}
	else
	myj ++;
}
var i=0;
while(i<($myimgs.length-1))
{
	if(width < 800 && $myimgs[i].width == width && $myimgs[i].height > minheight && $myimgs[i].height < maxheight)
	//if(width < 800 && $myimgs[i].width == width && $myimgs[i].height == height)
	samecount++;
	if(width >= 800 && $myimgs[i].width == width)
	seamcount++;
	i++;
}
if ((height >150 && samecount >7)||(height <=150 && samecount > 3))
		flag = true;
else
		flag = false;


answers = get_price($($myimgs[pos]),flag);

return ('{"price": "' + answers.amount + '" ,"currency": "' + answers.currency +  '"}');
};


// removing default options passed by the Python executable
casper.cli.drop("cli");
casper.cli.drop("casper-path");
if (casper.cli.args.length === 0 && Object.keys(casper.cli.options).length === 0) {
    casper
        .echo("Pass some args and options to see how they are handled by CasperJS")
        .exit(1)
    ;
}


casper.start(myurl, function() {

});

casper.then(function() {
             this.echo((this.evaluate(countLinks,myimg_url)));
        });

casper.run();
