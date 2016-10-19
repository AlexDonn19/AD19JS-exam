// document.addEventListener('DOMContentLoaded', (function (jQuery) {
// (function ($){

// window.onload = function(jQuery) {

// данные
    function makeRandomData(firstData) {

        // var , temporaryValue, randomIndex ;
        var currentIndex, temporaryValue, randomIndex ;
        currentIndex = firstData.images.length - 1;

          // While there remain elements to shuffle...
          while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = firstData.images[currentIndex];
            firstData.images[currentIndex] = firstData.images[randomIndex];
            firstData.images[randomIndex] = temporaryValue;
          };

        return firstData;
    };

	function takeNewData(newTheme) {

		  // IE8 & 9 only Cross domain JSON GET request
	    if ('XDomainRequest' in window && window.XDomainRequest !== null) {

	        var xdr = new XDomainRequest(); // Use Microsoft XDR

	        xdr.open('get', 'http://api.pixplorer.co.uk/image?word=' + newTheme + '&amount=7&size=tb');
	        xdr.onload = function () {
	            var dom  = new ActiveXObject('Microsoft.XMLDOM'),
	                JSON = $.parseJSON(xdr.responseText);

	            dom.async = false;

	            if (JSON == null || typeof (JSON) == 'undefined') {
	                JSON = $.parseJSON(data.firstChild.textContent);
	            };
	            //successCallback(JSON); // internal function

				if (JSON.status != "failed") {
	                renderList(JSON);
                    doMasonry();
                    ie8shadowAdd('.grid');
	            };
	        };


	        xdr.onerror = function() {
	            _result = false;
	        };

	        xdr.send();
	    }

	    // IE7 and lower can't do cross domain
	    else if (navigator.userAgent.indexOf('MSIE') != -1 &&
	             parseInt(navigator.userAgent.match(/MSIE ([\d.]+)/)[1], 10) < 8) {
	       		return false;
	    	}
	    	else        // Do normal jQuery AJAX for everything else
			{
				var jqXHR = $.ajax({
						type: "GET",
						cache: false,
						url: 'http://api.pixplorer.co.uk/image?',
						dataType: 'json',
						data: {word: newTheme,
								amount: 7,
								size: 'tb'},
						contentType: "application/json; charset=utf-8",
						success: function(){
						    return jqXHR.responseText;
						}
				    });

				jqXHR.done(function (data, jqXHR) {
					if (data.status != "failed") {
		                renderList(data);
					    doMasonry();
		            };
				});

			    jqXHR.fail(function(jqXHR, textStatus, errorThrown) {
			      var message =  ": ";
			      if (textStatus == 'parsererror')    message += "Parsing request was failed – " + errorThrown;
			      else if (errorThrown == 'timeout')  message += "Request time out.";
			      else if (errorThrown == 'abort')    message += "Request was aborted.";
			      else if (jqXHR.status === 0)        message += "No connection.";
			      else if (jqXHR.status)              message += "HTTP Error " + jqXHR.status + " – " + jqXHR.statusText + ".";
			      else                                message += "Unknown error.";
			      console.error(message);
			    });
			}
	};

// виджет

    function ie8shadowAdd(place) {
        var $placeInput = $(place).find('.ie8shadow');
        var $addDIV = document.createElement('div');
        $addDIV.innerText = '';
        $addDIV.style.display = "block";
        $addDIV.style.width = "100%";
        $addDIV.style.height = "100%";
        $addDIV.style.background = "#000";
        $addDIV.style.position = "absolute";
        $addDIV.style.left = "0";
        $addDIV.style.top = "0";
        $addDIV.style.filter = "alpha(Opacity=25)";
        $addDIV.style.zIndex = "1";

        for (var i = 0; i < $placeInput.length; i++) {
            $placeInput[i].appendChild($addDIV);
            $placeInput[i].innerHTML += '<div></div>';
        };
    };

	function doMasonry() {
        var masonryOptions;

        masonryOptions = {
          itemSelector: '.grid-item',
          gutter: 18,
          fitWidth: true,
          columnWidth: '.grid-sizer'
        };

        var $grid = $('.grid');

        $grid.masonry('reloadItems');
        $grid.masonry('layout');
        $grid.masonry( masonryOptions );
        $grid.masonry('layout');
        $grid.masonry('reloadItems');

        $('.grid-item').on( 'click', function() {
        	if ($(this).hasClass('grid-sizer')) {return};
        	if ($(this).hasClass('grid-item--width2')) {            // нажали на большую
        		var smallPict = $('.grid-item').not('.grid-item--width2');
        		$(smallPict[1]).toggleClass('grid-item--width2');

			} else {                                           // нажали на маленькую
				var bigPict = $('.grid-item--width2');

	        	if ($(this).hasClass('grid-last') && $(this).prev().hasClass('grid-item--width2') ) {              // на последнюю и предпосленяя большая
	        		$(bigPict[1]).toggleClass('grid-item--width2');
	        	} else {

					if ( $(this).next().hasClass('grid-last') && $('.grid-last').hasClass('grid-item--width2') ) {          // на предпоследнюю и последняя большая
        			$('.grid-last').toggleClass('grid-item--width2');  // уменьшить последнюю
	        		} else {
	        			$(bigPict[0]).toggleClass('grid-item--width2');
	        		}
	        	}
			};
	        $(this).toggleClass('grid-item--width2');
	        // trigger layout after item size changes
	        $grid.masonry('layout');
        });
    };

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

	function renderList(JSONdata) {
		var data = JSONdata;              // отпарсить строку
		var inputPlace =  document.getElementById('activity_container');   // куда вставлять картинки
		inputPlace.innerHTML = '';     // очистить старое содержимое

		var shablon = document.getElementById('make-activities').innerHTML;  // найти шаблон
		var actList = tmpl(shablon, data);
		inputPlace.innerHTML += actList;                     // добавить картинки

		//var elementsGrid = document.getElementsByClassName('grid-item');     // список картинок
		var elementsGrid = $('.grid-item');

		elementsGrid[0].classList.add('grid-sizer');     // первая картинка - стандарт колонок
		elementsGrid[6].classList.add('grid-last');

		var itemLeft = 2;                // случайные две картинки сделать двойным размером
		do {
			var makeBigIndex = getRandomInt(1, 5);  // но не первую - она стандарт
			  										// не последнюю - замыкающая
			if(!elementsGrid[makeBigIndex].classList.contains('grid-item--width2')) {
				elementsGrid[makeBigIndex].classList.add('grid-item--width2');
				itemLeft--;
			};
		} while (itemLeft != 0);

        return true;
	};

// carousel

    function ie8getElementsByClass(classList, node) {
        var node = node || document, // узел, в котором ищем
            list = node.getElementsByTagName('*'),  // выбираем все дочерние узлы
            length = list.length, // количество дочерних узлов
            classArray = classList.split(/\s+/), // разбиваем список классов
            classes = classArray.length, // длина списка классов
            result = [], i,j;
        for(i = 0; i < length; i++) { // перебираем все дочерние узлы
            for(j = 0; j < classes; j++)  { //перебираем все классы
                if(list[i].className.search('\\b' + classArray[j] + '\\b') != -1) { // если текущий узел имеет текущий класс
                    result.push(list[i]); // запоминаем его
                    break; // прекращаем перебор классов
                };
            };
        };
        return result; // возвращаем набор элементов
    };


    function moveSlider(objectToMove, startPos, endPos, slideStep) {
        if (startPos === endPos) {
            objectToMove.style.left = endPos + 'px';
            return;
        };
        var fullMove = Math.abs(startPos - endPos);   // общая длина сдвига
        var slideIterr = fullMove/slideStep ^ 0;      // количество шагов
        var slowStart = 10;                           // замедлить старт
        var slowControl = slowStart;
        slideIterr += slowStart;
        var lastSteps = (slowControl/slideStep ^ 0);  // сколько последних шагов пропустить
        var i = startPos;
        var delta = ( startPos > endPos ) ? 1 : -1;   // определить направление
        var interval = setInterval(function() {
            if (slowStart == 0) {         // увеличить шаг до заданого после конца замедления
               delta *= slideStep;
            };
            slideIterr--;
            slowStart--;
            i -= delta;                               // местоположение
            objectToMove.style.left = i + 'px';
            if ( slideIterr == lastSteps ) {          // последние шаги=замедление пропустить
                clearInterval(interval);
                objectToMove.style.left = endPos + 'px';
            };
        }, 1);
        return;
    };



    function carousel(obj, start) {

        var sliderList = obj.getElementsByTagName('ul')[0];  //
        var slideItemList = obj.getElementsByTagName('li');  // найти все слайды

        var slideItemSize = slideItemList[0].offsetWidth;  // узнать ширину слайда
        var slideNum = slideItemList.length;          // сколько всего слайдов
        var sliderLength = slideItemSize * slideNum;  // ширина слайдера

        // найти кнопки управления
        if ('getElementsByClassName' in window) {         // если нормальный браузер
            var bntLeft = obj.getElementsByClassName('control_left')[0];
            var bntRight = obj.getElementsByClassName('control_right')[0];
        } else {                                           // если ie8
            var bntLeft = obj.querySelectorAll('.control_left')[0];
            var bntRight = obj.querySelectorAll('.control_right')[0];
        }

        // отразить стартовый слайд - start
        var startActNum = ( start < slideNum ? start : 0 );
        var currentLeftValue = - startActNum * slideItemSize;  // выставить положение стартового
        sliderList.style.left = currentLeftValue +'px';

        var currentNum =  startActNum;
        var minimumOffset = - (sliderLength - slideItemSize);
        var maximumOffset = 0;

        if (document.addEventListener) {                 // если нормальный браузер

            bntLeft.addEventListener('click', function () {
                if (currentLeftValue != maximumOffset) {
                    moveSlider(sliderList, currentLeftValue, currentLeftValue+slideItemSize, 2);
                    currentLeftValue += slideItemSize;
                    currentNum--;
                } else {
                    moveSlider(sliderList, currentLeftValue, minimumOffset, 20);
                    currentLeftValue = minimumOffset;
                    currentNum = slideNum - 1;
                }
            });

            bntRight.addEventListener('click', function () {
                if (currentLeftValue != minimumOffset) {
                    moveSlider(sliderList, currentLeftValue, currentLeftValue-slideItemSize, 2);
                    currentLeftValue -= slideItemSize;
                    currentNum++;
                } else {
                    moveSlider(sliderList, currentLeftValue, maximumOffset, 20);
                    currentLeftValue = maximumOffset;
                    sliderList.style.left = currentLeftValue +'px';
                    currentNum = 0;
                }
            });

            window.addEventListener("resize", function () {
                slideItemSize = slideItemList[0].offsetWidth;
                sliderLength = slideItemSize * slideNum;
                currentLeftValue = - currentNum * slideItemSize;
                sliderList.style.left = currentLeftValue +'px';
                minimumOffset = - (sliderLength - slideItemSize);
            });

        } else {

            bntLeft.attachEvent('onclick', function () {
                slideItemSize = slideItemList[0].offsetWidth;
                if (currentNum != 0) {
                    moveSlider(sliderList, -(currentNum)*slideItemSize, -(--currentNum)*slideItemSize, 10);
                } else {
                    moveSlider(sliderList, -(currentNum)*slideItemSize, -(slideNum-1)*slideItemSize, 50);
                    currentNum = slideNum - 1;
                }
            });

            bntRight.attachEvent('onclick', function () {
                slideItemSize = slideItemList[0].offsetWidth;
                if (currentNum != (slideNum-1)) {
                    moveSlider(sliderList, -(currentNum)*slideItemSize, -(++currentNum)*slideItemSize, 10);
                } else {
                    moveSlider(sliderList, -(currentNum)*slideItemSize, maximumOffset, 50);
                    currentNum = 0;
                }
            });

            obj.attachEvent('onresize', function(){
                slideItemSize = slideItemList[0].offsetWidth;
                currentLeftValue = - (currentNum * slideItemSize);
                sliderList.style.left = currentLeftValue +'px';
            });
        }
    };


// управление

 window.onload = function() {
    // alert( 'Документ и все ресурсы загружены' );

    var firstJSONtext = '{"images":[{"imageurl":"./img/act1.jpg","word":"Sport and Activity"},{"imageurl":"./img/act2.jpg","word":"Wellnes and Health"},{"imageurl":"./img/act3.jpg","word":"Extreme Sports and Expeditions"},{"imageurl":"./img/act4.jpg","word":"Games"},{"imageurl":"./img/act5.jpg","word":"Culture and Education"},{"imageurl":"./img/act6.jpg","word":"Relaxation"},{"imageurl":"./img/act7.jpg","word":"Travelling"}],"status":"success","count":7}';
    var jsonData = JSON.parse(firstJSONtext);
    var activityToFind;

    makeRandomData(jsonData);
    renderList(jsonData);

    $('.grid-item').find('img').addClass('img_first');
    doMasonry();

    var form = document.getElementById('discover');

    if('XDomainRequest' in window && window.XDomainRequest !== null) {
            ie8shadowAdd('body');
            form.attachEvent('onsubmit', function(event) {

                event.returnValue = false;
                activityToFind = document.getElementById('interests').value;
                document.getElementById('interests').value = '';
                takeNewData(activityToFind);
                return false;});

        }  else {
            form.onsubmit = function(event) {
                event.preventDefault();
                activityToFind = document.getElementById('interests').value;
                document.getElementById('interests').value = '';
                takeNewData(activityToFind);
                }
            };

    // carousel

    var sliderBlock, allSliders;
    sliderBlock = document.getElementById("sliderBlock");

    if (document.getElementsByClassName) {
            allSliders = sliderBlock.getElementsByClassName("slider");
    } else { // если родной функции нет, то будем обходить DOM
        allSliders = ie8getElementsByClass("slider", sliderBlock);
    };

    var carousel1 = new carousel(allSliders[0], 0);
    var carousel2 = new carousel(allSliders[1], 1);
    var carousel3 = new carousel(allSliders[2], 2);

};





// })(jQuery);





