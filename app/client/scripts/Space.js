/**
 * A space partitioning system for 2D objects.
 * @class Space
 */
function Space(cellSize=10){
	if(!new.target){
		return new Space(...arguments);
	}

	const grid = new Map();

	Object.defineProperties(this, {
		// add an item to the space
		// if the item is already in the space, it will be moved to the new location
		// this may require a remove call to the old location
		add: {
			value: function(x, y, item){
				// console.log('add to grid', x, y, items);
				const key = `${Math.floor(x / cellSize)},${Math.floor(y / cellSize)}`;
				// console.log('key', key);
				if(grid.has(key)){
					const cell = grid.get(key);
					if(!cell.includes(item)){
						// console.log('add item', item);
						cell.push(item);
					}
				}else{
					// console.log('new cell');
					grid.set(key, [item]);
				}
			}
		},
		get: {
			// return all items in the cell at the given location
			// as well as any items in all adjacent cells
			value: function(x, y){
				const key = `${Math.floor(x / cellSize)},${Math.floor(y / cellSize)}`;
				const cell = grid.get(key) ?? [];
				// grid.delete(key);
				return cell;
			}
		},
		remove: {
			value: function(x, y, item){
				const key = `${Math.floor(x / cellSize)},${Math.floor(y / cellSize)}`;
				const cell = grid.get(key);
				if(cell !== undefined){
					const index = cell.indexOf(item);
					if(index !== -1){
						cell.splice(index, 1);
					}
				}
			}
		}
	});
}

// function OctTree(){
// 	if(!new.target){
// 		return new OctTree(...arguments);
// 	}

// 	const root = new Node();
// 	const maxDepth = 8;
// 	const maxItems = 8;

// 	Object.defineProperties(this, {
// 		add: {
// 			value: function(x, y, item){
// 				root.add(x, y, item, 0);
// 			}
// 		},
// 		get: {
// 			value: function(x, y){
// 				return root.get(x, y);
// 			}
// 		},
// 		remove: {
// 			value: function(x, y, item){
// 				root.remove(x, y, item);
// 			}
// 		}
// 	});
// }

module.exports = {
	Space
};
