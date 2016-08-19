
function genUrl(){
	this.url = '';
	this.questionMarkAppended = false;
}

genUrl.prototype.clear = function(basePath){
	this.url = '';
}

genUrl.prototype.getUrl = function(basePath){
	return this.url;
}

genUrl.prototype.setBase = function(basePath){
	this.url = basePath;
}

genUrl.prototype.join = function(newpath){
	this.url += '/' + newpath;
}
genUrl.prototype.addLimit = function(limit){
	if(this.questionMarkAppended)
		this.url += '&limit='+limit;
	else
		this.url += '?limit='+limit;
		this.questionMarkAppended = true;
}

genUrl.prototype.addQL = function(ql){
	if(this.questionMarkAppended)
		this.url += '&ql='+ ql;
	else
		this.url += '?ql='+ ql;
		this.questionMarkAppended = true;
}

genUrl.prototype.addPageHint = function(ql){
	if(this.questionMarkAppended)
		this.url += '&cursor='+ ql;
	else
		this.url += '?cursor='+ ql;
		this.questionMarkAppended = true;
}

exports.genurl = genUrl;