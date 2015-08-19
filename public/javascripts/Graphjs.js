function Init_ESC_Graph(target){
		var ESC_Graph_element = {
				max_x : 100,
				data_points : [{x:0,y:0}],
				options : {
				axisX:{
					gridColor : "white"
				},
				axisY:{
					minimum : 0,
					maximum : 900,
					stripLines:[
					{                
						startValue:500,
						endValue:750,                
						color:"yellow"                      
					},
					{                
						startValue:700,
						endValue:1000,                
						color:"red"                      
					}
					],
					gridThickness: 0
				},
				data: [
				{
					type: "line",
					color:"black",
					lineThickness: 1,
					markerSize : 0,
					dataPoints: this.data_points
				}
				]
			}
		};
		ESC_Graph_element.target = target;
		target.CanvasJSChart(ESC_Graph_element.options);
		return ESC_Graph_element;
	}	

function Init_Battery_Graph(target){
		var Battery_Graph_element = {
				max_x : 100,
				data_points : [{x:0,y:0}],
				options : {
				axisX:{
					gridColor : "white"
				},
				axisY:{
					minimum : 5,
					maximum : 10,
					gridThickness: 0
				},
				data: [
				{
					type: "line",
					color:"black",
					lineThickness: 1,
					markerSize : 0,
					dataPoints: this.data_points
				}
				]
			}
		};
		Battery_Graph_element.target = target;
		target.CanvasJSChart(Battery_Graph_element.options);
		return Battery_Graph_element;
	}	

	function Update_Graph(Graph_handler, new_data){
		var x_len = Graph_handler.data_points.length;
		var x_num = Graph_handler.data_points[x_len-1].x+1;
		Graph_handler.data_points.push({x:x_num,y:new_data});
		if(x_len == Graph_handler.max_x)
			Graph_handler.data_points.shift();
		Graph_handler.options.data = [
				{
					type: "line",
					color:"black",
					lineThickness: 1,
					markerSize : 0,
					dataPoints: Graph_handler.data_points
				}
				];
		Graph_handler.target.CanvasJSChart(Graph_handler.options);
	}