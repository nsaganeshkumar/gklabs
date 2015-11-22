function complexNumberBondUI() {
	var $scope;			
	var partCanvases = new Array();
	
	var dx = 0;
	var dy = 40;
	var radius = 30;
     
	var min_dx;
	var max_dx = dx; 
	var max_dy = dy;

    var canvas = $('#canvas')[0];
    var ctx = $('#canvas')[0].getContext("2d");
    
    var parts = [];
	var partsTree = [];
	var maxDepth = 1;
	var maxParts = 2;
	
    this.reset = function() {
    	ctx.clearRect(0,0, $("#canvas")[0].width, $("#canvas")[0].height);
        
    	parts = [];
    	partsTree = [];
    	maxDepth = 1;
    	maxParts = 2;
    	
        dx = 0;
        dy = 10;
        radius = 30;
        
        min_dx = null;
        max_dx = dx; 
        max_dy = dy;
        
        partCanvases = new Array();
    };
    
	this.draw = function(scope, numberBondNew) {
		$scope = scope;
		this.numberBondProblem = numberBondNew;
		
		this.reset();
		
		var partsArr = [];
		partsArr.push(this.numberBondProblem);
		orgainizeInRows(partsArr);
        
		max_dy = maxDepth * (radius * 4) - 50;
		dy = max_dy;
		dx = radius * 2;
		var partsRow = partsTree[0];
		for (var j=0; j < partsRow.length; j++) {
			if (partsRow[j].depth == maxDepth) {								
				partsRow[j].dx = dx;
				partsRow[j].dy = dy;
				
				dx += radius * 4;				
			}				
		}
		
		for (var i=1; i < partsTree.length; i++) {
			console.log("calc dx for row index: " + i);
			partsRow = partsTree[i];
			dy = dy - (radius * 4);
		
			for (var j=0; j < partsRow.length; j++) {				
				partsRow[j].dy = dy;
				
				if (partsRow[j].parts) {
					partsRow[j].dx = partsRow[j].parts[0].dx + (partsRow[j].parts[1].dx - partsRow[j].parts[0].dx)/2;
					if (max_dx < partsRow[j].dx) {
						max_dx = partsRow[j].dx;
					}
				} 
			}
		}
		console.log("partsTree : " + JSON.stringify(partsTree));
		
		ctx.canvas.width = max_dx + (radius * 4);
        ctx.canvas.height = max_dy + (radius * 4);
		
		construct();
	};
	
	function orgainizeInRows(partsArr) {		
		dy = dy + (radius * 4);
		
		var partsRow = [];
    	for (var i=0; i < partsArr.length; i++) {
    		partsArr[i].dy = dy;
    		partsArr[i].depth = maxDepth;
    		
    		if (partsArr[i].parts) {
    			console.log("concating: " + partsArr[i].parts.length);
    			partsRow = partsRow.concat(partsArr[i].parts);
    		}
    	}	    	
    	
    	if (partsRow.length > 0) {
    		maxDepth++;
    		orgainizeInRows(partsRow);
    	}
    	console.log("parts in the each row: " + maxDepth + " " + partsArr.length);
		partsTree.push(partsArr);
    }
	
	function construct() {
		for (var i=0; i < partsTree.length; i++) {
			var partsRow = partsTree[i];
			
			for (var j=0; j < partsRow.length; j++) {				
				var partImg = new ComplexPart(partsRow[j]);
				partCanvases.push(partImg);
				partImg.draw();
			}
		}
    }
	
    canvas.onclick = function (e) {        	
    	var pt  = {
                x : e.pageX - $(document).scrollLeft() - $('#canvas').offset().left,
                y : e.pageY - $(document).scrollTop() - $('#canvas').offset().top
              };
    	
        for (var i = 0; i < partCanvases.length; i++) {            	
            if (partCanvases[i].hitTest(pt.x, pt.y)) {
            	if (!partCanvases[i].partObj.showValue) {
            		$scope.showEnterPartDialog(partCanvases[i]);            		
            		break;
            	}
            }
        }
    };

    function ComplexPart(partObj) {
    	this.partObj = partObj;
    	this.radius = radius;
    	
    	this.draw = function() {        		        		
    		if (this.partObj.showValue) {
    			ctx.strokeStyle = "black";
    			ctx.fillStyle = "#F0F0F0";
    		} else {
    			ctx.strokeStyle = "black";
    			ctx.fillStyle = "#ffffff";
    		}
            
        	ctx.beginPath();
        	ctx.arc(this.partObj.dx, this.partObj.dy, this.radius, 0, Math.PI*2, true);
        	ctx.fill();
        	ctx.closePath();
        	
        	ctx.fillStyle = 'black';
        	ctx.font="20px Arial bold";
        	var len = ctx.measureText(this.partObj.value).width/2;
        	ctx.fillText(this.partObj.value, this.partObj.dx - len, this.partObj.dy + 5);
        	ctx.stroke();
        	
        	if (partObj.parts) {
//        		console.log("line from: (" + this.partObj.dx + " " + (this.partObj.dy + 30) + ") (" + this.partObj.parts[0].dx + " " (this.partObj.parts[0].dy - 30) + ")");
	        	ctx.strokeStyle = "black";
	    		
	        	ctx.beginPath();
				ctx.moveTo(this.partObj.dx, this.partObj.dy + 30);
				ctx.lineTo(this.partObj.parts[0].dx, this.partObj.parts[0].dy - 30);
				ctx.stroke();				
				
				ctx.moveTo(this.partObj.dx, this.partObj.dy + 30);
				ctx.lineTo(this.partObj.parts[1].dx, this.partObj.parts[1].dy - 30);
				ctx.stroke();
        	}
    	};
    	
    	this.drawText = function() {
    		ctx.font="20px Arial";
    		if (this.partObj.showValue) {
    			ctx.strokeStyle = "black";
    		} else {
    			ctx.strokeStyle = "black";
    		}

    		ctx.clearRect(this.partObj.dx - radius, this.partObj.dy - this.radius, this.radius * 2, this.radius * 2);
    		
    		ctx.beginPath();
        	ctx.arc(this.partObj.dx, this.partObj.dy, this.radius, 0, Math.PI*2, true);
        	ctx.closePath();
        	        		            	
        	var len = ctx.measureText(this.partObj.value).width/2;
        	ctx.fillText(this.partObj.value, this.partObj.dx - len, this.partObj.dy + 5);
        	ctx.stroke();            	
    	};
    	
    	this.hitTest = function (x, y) {
            var dx = x - this.partObj.dx;
            var dy = y - this.partObj.dy;
            return dx * dx + dy * dy <= this.radius * this.radius;
        };
    }
                          
}


