	function NumberBond(maxNumber, depth, nParts) {
		this.maxNumber = maxNumber;
		this.depth = depth;
		this.nParts = nParts;
		
		this.generate= function () {
			var rand = Math.floor((Math.random() * this.maxNumber));
			if (rand < 5) {
				rand += 5;
			}
			return this.generateParts(rand, this.depth, this.nParts, true, true);
		};
		
		this.generateParts = function (whole, depth, nParts, isWholeNumberShown, isRoot) {
			var numberBond = newPart(whole, true);
			
			var parts = [];
			var maxValue = whole;
			var sumOfParts = 0;
			
			var partValues = [];
			for (var i=0; i < nParts-1; i++) {
				var rand = Math.floor((Math.random() * maxValue));
				var part = newPart(rand, true);
								
				if (part.value <= 1 && $.inArray(part.value, partValues) >= 0) {
					continue;
				}
				partValues.push(part.value);
				parts.push(part);
				
				sumOfParts += part.value;			
				maxValue = maxValue - sumOfParts;
			}
			var part = newPart((whole - sumOfParts), true);
			parts.push(part);
			
			var rand = Math.floor((Math.random() * 10) % (parts.length + 1));
			
			numberBond.parts = parts;
			if (rand == 0) {
				if (isWholeNumberShown) {
					numberBond.showValue = false;
				} else {
					parts[rand].showValue = false;
				}
			} else {
				parts[rand-1].showValue = false;
			}
			
			if (depth != 1) {
				var partObj = parts[0];
				var nextWholeIndex = 0;
				for (var i=1; i < parts.length; i++) {
					if (parts[i].value > partObj.value) {
						partObj = parts[i];
						nextWholeIndex = i;
					}
				}
				
				var nextWhole = this.generateParts(partObj.value, depth - 1, nParts, partObj.showValue, false);
				if (!partObj.showValue) {
					nextWhole.showValue = partObj.showValue;
				}				
				parts[nextWholeIndex] = nextWhole;			
			}
			
			if (numberBond.parts) {
				for (var i=0; i < numberBond.parts.length; i++) {
					if (!numberBond.parts[i].showValue) {
						numberBond.parts[i].value = "";
					}
				}
				if (!numberBond.showValue) {
					numberBond.value = "";
				}
			}
			
			return numberBond;
		};
		
		function newPart(value, showValue) {
			var part = {};
			part.value = value;
			part.showValue = showValue;
			
			return part;
		}
	}
	
	
	
	function complexNumberBond(maxNumber) {
		this.maxNumber = maxNumber;
		this.nParts = 2;
		
		this.minPartValue = 5;
		this.maxDepth = 2;
				
		this.generate= function () {
			return this.generateParts(this.maxNumber, this.nParts, true, true, 1);
		};
		
		this.generateParts = function (whole, nParts, isWholeNumberShown, isRoot, depth) {			
			var numberBond = newPart(whole, true);
			
			var parts = [];
			var maxValue = whole;
			var sumOfParts = 0;
			
			var partValues = [];
			for (var i=0; i < nParts-1; i++) {
				var rand = Math.floor((Math.random() * maxValue));
				if (rand < 1) {
					rand += Math.floor((whole - sumOfParts)/2);
				}
				var part = newPart(rand, true);
												
				partValues.push(part.value);
				parts.push(part);
				
				sumOfParts += part.value;			
				maxValue = maxValue - sumOfParts;
			}
			var part = newPart((whole - sumOfParts), true);
			parts.push(part);
			
			var rand = Math.floor((Math.random() * 10) % (parts.length + 1));
			
			numberBond.parts = parts;
			if (rand == 0) {
				if (isWholeNumberShown) {
					numberBond.showValue = false;
				} else {
					parts[rand].showValue = false;
				}
			} else {
				parts[rand-1].showValue = false;
			}
			
			if (depth <= this.maxDepth) {
				for (var i=0; i < parts.length; i++) {
//					if (parts[i].value > this.minPartValue) {
//						
//					}
					var nextWhole = this.generateParts(parts[i].value, nParts, parts[i].showValue, false, depth + 1);
					if (!parts[i].showValue) {
						nextWhole.showValue = parts[i].showValue;
					}				
					parts[i] = nextWhole;
				}
			}
			
			if (numberBond.parts) {
				for (var i=0; i < numberBond.parts.length; i++) {
					if (!numberBond.parts[i].showValue) {
						numberBond.parts[i].value = "";
					}
				}
				if (!numberBond.showValue) {
					numberBond.value = "";
				}
			}
						
			return numberBond;
		};
		
		function newPart(value, showValue) {
			var part = {};
			part.value = value;
			part.showValue = showValue;
			
			return part;
		}
	}