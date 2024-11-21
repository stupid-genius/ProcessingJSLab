/**
 * A space partitioning system for 2D objects.
 * @class Space
 */
function Space(){
	if(!new.target){
		return new Space(...arguments);
	}

	const grid = new Map();
	const cellSize = 10;

	Object.defineProperties(this, {
		add: {
			value: function(item, x, y){
				const key = `${Math.floor(x / cellSize)},${Math.floor(y / cellSize)}`;
				if(grid.has(key)){
					grid.get(key).push(item);
				}else{
					grid.set(key, [item]);
				}
			}
		},
		get: {
			value: function(x, y){
				const key = `${Math.floor(x / cellSize)},${Math.floor(y / cellSize)}`;
				return grid.get(key) ?? [];
			}
		},
		remove: {
			value: function(item, x, y){
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

// Octree

module.exports = {
	Space
};
