function showMessage(title, mesg, type) {
	if (!type) {
		type = BootstrapDialog.TYPE_DANGER;
	}
	
	BootstrapDialog.show({
        title: title,
        message: mesg,
        type: type,
        buttons: [{
            label: 'Ok',
            action: function(dialogItself){	        	                	
            	dialogItself.close();
            }
        }
       ]
	});
}

Array.prototype.isSame = function(a) {
	return this.notIn(a).length === 0 && a.notIn(this).length === 0;
};

Array.prototype.diff = function(a) {
	return this.filter(function(i) {return a.indexOf(i) < 0;});
};

Array.prototype.unique = function() {
	var o = {}, i, l = this.length, r = [];
	for(i=0; i<l;i+=1) o[this[i]] = this[i];
	for(i in o) r.push(o[i]);
	return r;
};

Array.prototype.intersect = function (b) {			
	return $.grep(this, function (i) {
		return $.inArray(i, b) > -1;
	});
};

Array.prototype.notIn = function (b) {			
	return $.grep(this, function (i) {
		return $.inArray(i, b) == -1;
	});
};