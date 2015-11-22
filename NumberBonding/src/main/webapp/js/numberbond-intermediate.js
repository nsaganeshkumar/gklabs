	function NumberBondPyramid(depth) {		
		this.maxBase = 20;
		this.depth = depth;
		this.nParts = 2;
		this.numberBond = {};
		
		this.trianglesUsed = [];
		this.partsRow = [];
		this.partTriangles = [];
		
		this.generate = function () {
			this.maxBase = Math.floor((Math.random() * 100) % 21);
			if (this.maxBase < 5) {
				this.maxBase = 5;
			}
			var partsArr = [];
			this.generateParts(partsArr, this.depth);
			this.setIndex();
			this.findPartTriangles(this.numberBond);
						
			this.openClues();
			this.hideValues(this.numberBond);
			return this.numberBond;
		};
		
		this.generateParts = function (partsArr, currentDepth) {
			if (currentDepth >= 0) {
				if (currentDepth == this.depth) {
					for (var i=0; i <= this.depth; i++) {
						var rand = Math.floor((Math.random() * 100) % this.maxBase);
						
						var part = newPart(rand, false, this.depth);
						partsArr.push(part);					
					}
					this.generateParts(partsArr, currentDepth-1);
					this.partsRow[currentDepth] = partsArr;
				} else {
					var wholeArr = [];
					for (var i=0; i < partsArr.length-1; i++) {
						var parts = [];
						parts.push(partsArr[i]);
						parts.push(partsArr[i+1]);
						
						var whole = newPart(parts[0].value + parts[1].value, false);
						whole.parts = parts;
						wholeArr.push(whole);
					}
					
					if (wholeArr.length == 1) {
						this.numberBond = wholeArr[0];
					}
					this.generateParts(wholeArr, currentDepth-1);
					this.partsRow[currentDepth] = wholeArr;					
				}
			}
		};
		
		this.openClues = function () {			
			var index = Math.floor((Math.random() * 100) % this.partTriangles.length);
			var triangle = this.partTriangles.splice(index, 1)[0];
			this.addToUsedTriangles(triangle);
			
			var rand = Math.floor((Math.random() * 10) % 3);
			for (var i=0; i < triangle.length; i++) {
				if (i != rand) {
					var p = this.findPart(triangle[i]);					
					p.showValue = true;
				}
			}

			var openedClues = 2;
			while (this.partTriangles.length > 0) {				
				var parts = this.selectAdjecentTriangleParts();
				
				rand = Math.floor((Math.random() * 10) % parts.length);
				this.findPart(parts[rand]).showValue = true;		
			}			
		};
		
		this.addToUsedTriangles = function (triangle) {
			this.trianglesUsed = this.trianglesUsed.concat(triangle);
			
			var sharedTriangleFound = false;
			do {
				sharedTriangleFound = false;
				for (var i=0; i < this.partTriangles.length; i++) {
					var arr = this.partTriangles[i];
					if (arr.intersect(this.trianglesUsed).length >= 2) {
						sharedTriangleFound = true;
						arr = this.partTriangles.splice(i, 1)[0];
						
						this.trianglesUsed = this.trianglesUsed.concat(arr);
						this.trianglesUsed = this.trianglesUsed.unique();
						break;
					}
				}
			} while (sharedTriangleFound);
		};		
		
		this.findPart = function (index) {
			for (var i=0; i < this.partsRow.length; i++) {
				var row = this.partsRow[i];
				for (var j=0; j < row.length; j++) {
					if (row[j].index == index) {
						return row[j];
					}
				}
			}
			return null;
		};
		
		this.setIndex = function () {
			var index = 0;
			for (var i=0; i < this.partsRow.length; i++) {
				var row = this.partsRow[i];
				for (var j=0; j < row.length; j++) {
					row[j].index = index;
					index++;
				}
			}
		};
		
		this.findPartTriangles = function (whole) {
			if (whole.parts) {
				var arr = [];
				arr.push(whole.index);
				for (var j=0; j < whole.parts.length; j++) {
					arr.push(whole.parts[j].index);
				}
				if (!this.isDuplicateTriangle(arr)) {
					this.partTriangles.push(arr);
				}
				
				for (var j=0; j < whole.parts.length; j++) {
					this.findPartTriangles(whole.parts[j]);
				}
			}
		};		
		
		this.selectAdjecentTriangleParts = function () {
			var adjTriangleIndexes = [];
			for (var j=0; j < this.partTriangles.length; j++) {
				if (this.partTriangles[j].intersect(this.trianglesUsed).length > 0 && 
								this.partTriangles[j].intersect(this.trianglesUsed).length <= 1) {
					adjTriangleIndexes.push(j);
				}
			}
						
			var index = Math.floor((Math.random() * adjTriangleIndexes.length));
			var triangle = this.partTriangles.splice(adjTriangleIndexes[index], 1)[0];
									
			var parts = triangle.notIn(this.trianglesUsed);
			
			this.addToUsedTriangles(triangle);						
			return parts;
		};
		
		this.isDuplicateTriangle = function (array1){
			for (var j=0; j < this.partTriangles.length; j++) {
				var array2 = this.partTriangles[j];
				var is_same = array1.isSame(array2);

				if (is_same) {
					return true;
				}
			}		
			return false;	
		};		
		
		this.hideValues = function (numberBond) {
			if (!numberBond.showValue) {
				numberBond.value = "";
			}
			
			if (numberBond.parts) {
				for (var i=0; i < numberBond.parts.length; i++) {
					this.hideValues(numberBond.parts[i]);
				}
			}
		};
		
		function newPart(value, showValue, depth) {
			var part = {};
			part.value = value;
			part.showValue = showValue;
			part.depth = depth;
			
			return part;
		}
		
	}