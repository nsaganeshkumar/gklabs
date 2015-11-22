function numberBondUI() {
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
    
    this.reset = function() {
    	$('#mainPanel').width($(window).width() - 3);
        $('#mainPanel').height($(window).height() - 98);
        
    	ctx.clearRect(0,0, $("#canvas")[0].width, $("#canvas")[0].height);
        
        dx = 0;
        dy = 40;
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
		
		measure(this.numberBondProblem, -1, -1, dx, dy, 1);
        
		ctx.canvas.width = max_dx - min_dx + (radius * 2);
        ctx.canvas.height = max_dy + 60;
		
        dx = Math.abs(min_dx) + (radius * 2);
		construct(this.numberBondProblem, -1, -1, dx, dy, 1);
	};
	
	function measure(numberBond, whole_dx, whole_dy, dx, dy, depth) {
		var whole = numberBond.value;
		var parts = numberBond.parts;
						
		depth++;
		whole_dx = dx;
		whole_dy = dy;
		
		dy = dy + (radius * 4);
		dx = dx - (parts.length * radius);
		if (!min_dx) {
			min_dx = dx;
		} else {
			if(dx < min_dx) {
				min_dx = dx;
			}
		}
    	for (var i=0; i < parts.length; i++) {        		
    		var part = parts[i];
    		if (part.parts) {		        			
    			measure(part, whole_dx, whole_dy, dx, dy, depth);
    		} 
    		dx += radius * 4;
    	}	        	
    	
    	if (dx > max_dx) {
    		max_dx = dx;
    	}
    	if (dy > max_dy) {
    		max_dy = dy;
    	}
    }
	
	function construct(numberBond, whole_dx, whole_dy, dx, dy, depth) {
		var whole = numberBond.value;
		var parts = numberBond.parts;
						
		var wholeImg = new Part(numberBond, whole_dx, whole_dy, dx, dy, depth);
		partCanvases.push(wholeImg);
		wholeImg.draw();
		
		depth++;
		whole_dx = dx;
		whole_dy = dy;
		
		dy = dy + (radius * 4);
		dx = dx - (parts.length * radius);
    	for (var i=0; i < parts.length; i++) {        		
    		var part = parts[i];
    		if (part.parts) {		        			
    			construct(part, whole_dx, whole_dy, dx, dy, depth);
    		} else {
    			var partImg = new Part(part, whole_dx, whole_dy, dx, dy, depth);
    			partCanvases.push(partImg);
    			partImg.draw();
    		}
    		dx += radius * 4;
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

    function Part(partObj, whole_dx, whole_dy, dx, dy, depth) {
    	this.partObj = partObj;
    	this.whole_dx = whole_dx;
    	this.whole_dy = whole_dy;
    	this.dx = dx;
    	this.dy = dy;
    	this.depth = depth;
    	this.radius = radius;
    	
    	this.draw = function() {        		        		
    		if (this.partObj.showValue) {
    			ctx.strokeStyle = "black";
    			ctx.fillStyle = "#F0F0F0";
    		} else {
    			ctx.strokeStyle = "black";
    			ctx.fillStyle = "#ffffff";
    		}
        	//ctx.fillStyle = "lightblue";

//    		ctx.shadowColor = '#989898';
//            ctx.shadowOffsetX = 0;
//            ctx.shadowOffsetY = 0;
//            ctx.shadowBlur    = 10;
            
        	ctx.beginPath();
        	ctx.arc(this.dx, this.dy, this.radius, 0, Math.PI*2, true);
        	ctx.fill();
        	ctx.closePath();
        	
        	ctx.fillStyle = 'black';
        	ctx.font="20px Arial bold";
        	var len = ctx.measureText(this.partObj.value).width/2;
        	ctx.fillText(this.partObj.value, this.dx - len, this.dy + 5);
        	ctx.stroke();
        	
        	if (this.whole_dx != -1) {
        		ctx.strokeStyle = "black";
        		
	        	ctx.beginPath();
    			ctx.moveTo(this.whole_dx, this.whole_dy + 30);
    			ctx.lineTo(this.dx, this.dy - 30);
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

    		ctx.clearRect(this.dx - radius, this.dy - radius, radius * 2, radius * 2);
    		
    		ctx.beginPath();
        	ctx.arc(this.dx, this.dy, this.radius, 0, Math.PI*2, true);
        	ctx.closePath();
        	        		            	
        	var len = ctx.measureText(this.partObj.value).width/2;
        	ctx.fillText(this.partObj.value, this.dx - len, this.dy + 5);
        	ctx.stroke();            	
    	};
    	
    	this.hitTest = function (x, y) {
            var dx = x - this.dx;
            var dy = y - this.dy;
            return dx * dx + dy * dy <= this.radius * this.radius;
        };
    }
                          
}


