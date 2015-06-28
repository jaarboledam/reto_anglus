$(document).ready(function() {
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	var animal = [{x:10, y:10},{x:10, y:280},{x:680, y:10},{x:680, y:280},{x:340, y:280}];

	var animal_requested;
	var animal_selected;
	var puntaje = 0;
	var aciertos = 0;
	var desaciertos = 0;
	
	var player = {x:360, y:140, img:document.getElementById("player"),
		restart:function(){
			this.x = 360; this.y = 140;
			dibujar();},
		update:function(){
		ctx.drawImage(this.img,this.x,this.y);}
	};
	
	/*Obtener datos del archivo externo data.json y guardarlos en 
	el vector de objetos animal. LLamar la función para dibujar en 
	el canvas y hacer el primer llamado a la función animalRequest*/
	$.getJSON("http://reto.anglus.co/data.json", function(data){
		$.each(data.words, function(index, value){
			animal[index].name = value.name;
			animal[index].img = value.image;
		});
		dibujar();
		animalRequest();
	});
	
	/*Obtener un número aleatorio entre 0 y 4, tomarlo como índice para 
	recorrer el vector de objetos animal, asignar la propiedad name
	a la variable animal_requested y ponerle como texto al objeto HTML
	com ID animalName*/
	function animalRequest(){
		var index = Math.floor((Math.random() * 5 - 1) + 1); 
		animal_requested = animal[index].name;
		$("#animalName").css({
			color: '#00A169',
			fontSize: '12pt',
			textShadow: '0 0 10px #00A169'
		});
		setTimeout(function(){
			$("#animalName").css({
				color: '#FFF',
				fontSize: '20pt'
			});
			$("#animalName").text(animal_requested);
		},1000);
	};

	/*Importa al canvas las imágenes de animales almacenadas en el vector 
	de objetos animal y hace un llamado a la función update del objeto player*/
	function dibujar(){
		ctx.clearRect(0,0,800,400);//Limpia todo el canvas
		for(var i = 0; i < animal.length; i++){
			var img = new Image();
			img.src = animal[i].img;
			ctx.drawImage(img,animal[i].x,animal[i].y);
		};
		player.update();
	};
	
	/*Valida que flecha se presiona, actualiza las coordenadas de player
	y redibuja en el canvas*/
	$(document).keydown(function(key){
		if(key.keyCode=='37'){//Flecha izquierda
			player.x -= 10;
			dibujar();
		};
		if(key.keyCode=='38'){//Flecha arriba
			player.y -= 10;
			dibujar();
		};
		if(key.keyCode=='39'){//Flecha derecha
			player.x += 10;
			dibujar();
		};
		if(key.keyCode=='40'){//Flecha abajo
			player.y += 10;
			dibujar();
		};
		colision();
	});
	
	/*Valida si hay colision de player con alguno de los animales
	inicia la variable crash en false, si alguna de las condiciones 
	de colision es verdadera, crash cambia a true y ejecuta la
	sentencia dentro del if*/
	function colision(){
		var crash = false;
		if(player.x >= animal[0].x && player.x <= animal[0].x + 50 
		&& player.y >= animal[0].y && player.y <= animal[0].y + 70){
			animal_selected = animal[0].name;
			crash = true;
		};
		if(player.x >= animal[1].x && player.x <= animal[1].x + 40 
		&& player.y >= animal[1].y && player.y <= animal[1].y + 80){
			animal_selected = animal[1].name;
			crash = true;
		};
		if(player.x >= animal[2].x && player.x <= animal[2].x + 40 
		&& player.y >= animal[2].y && player.y <= animal[2].y + 70){
			animal_selected = animal[2].name;
			crash = true;
		};
		if(player.x >= animal[3].x && player.x <= animal[3].x + 40 
		&& player.y >= animal[3].y && player.y <= animal[3].y + 70){
			animal_selected = animal[3].name;
			crash = true;
		};
		if(player.x >= animal[4].x && player.x <= animal[4].x + 40 
		&& player.y >= animal[4].y && player.y <= animal[4].y + 70){
			animal_selected = animal[4].name;
			crash = true;
		};

		if (crash === true) {
			player.restart();
			$("#test").slideDown('slow');
			if(animal_requested !== animal_selected){
				desaciertos++;
				$("#err").css('visibility', 'visible');
				$("#test").text("Haz fallado!");
				setTimeout(function(){
					$("#err").css('visibility', 'hidden');
					refresh();
					animalRequest();
				}, 3000);
			}else{
				aciertos++;
				$("#ok").css('visibility', 'visible');
				$("#test").text("Muy bien!");
				setTimeout(function(){
					$("#ok").css('visibility', 'hidden');
					refresh();
					animalRequest();
				}, 3000);
			};
		};
	};

	function refresh(){
		puntaje = (aciertos * 10) - (desaciertos * 10);
		$("#test").fadeOut('slow');
		$("#puntaje").text("Puntos: " + puntaje)
		$("#fail").text("Desaciertos: " + desaciertos);
		$("#good").text("Aciertos: " + aciertos);
	};
});