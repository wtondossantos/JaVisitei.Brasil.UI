<template>
	<section v-if="errored" id="aviso">
		<p>Pedimos desculpas, não estamos conseguindo recuperar as informações no momento. Por favor, tente novamente mais tarde.</p>
	</section>
  	<section v-else>
		<div id="loader" aria-hidden="true" v-if="loading">
			<div></div>
		</div>
		<div v-else>
			<div id="tooltip" ref="tooltip" style="top: 0; left: 0; display: none"></div>
			<div id="javisitei" ref="javisitei" style="display:none">
				<button id="closeJavisitei" @click="onClickCloseJavisitei">X</button>
				<h3 id="cityName" ref="cityName" style="color:#000"></h3>
				<h2 id="stateName" ref="stateName" style="color:#000"></h2>
				
				<fieldset class="block-1">
					<label for="annotation">Nota: </label>
					<textarea name="comment" ref="annotation" id="annotation" placeholder="Adicionar nota" alt="Campo para adicionar anotação desejada."></textarea>
				</fieldset>
				<fieldset class="block-2">
					<label for="date">Data: </label>
					<input type="date" id="date" ref="date" alt="Campo para selecionar data desejada. exemplo: data de visita."/>
					<label for="color">Colorir: </label>
					<input type="text" id="hexcolor" ref="hexcolor" @change="onChangeHexcolor" placeholder="#f2ec45" alt="Campo para adicionar cor em hexadecimal." />
					<input type="color" id="color" ref="color" @change="onChangeColor" value="#f2ec45" alt="Campo para clicar e selecionar cor." />
				</fieldset>
				<input type="button" id="salvar" value="Pinar" @click.prevent="onClickPinar" alt="Botão para salvar visita." />
				<input type="button" id="remover" value="Remover" @click.prevent="onClickPinRemove" alt="Botão para remover visita." />
			</div>
			<div id="main" @wheel="onWheelMain" @mousedown="onMouseDownMain" @mouseup="onMouseUpMain" @mousemove="onMouseMoveMain">
				<svg id="map" :width="innerWidth" :height="innerHeightNew" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" >
					<g class="map-g" id="mapg" :style="styleTransform">
						<desc>Brasil</desc>
						<g v-for="state in brazil?.states?.$values" v-bind:key="state.$id" :id="state.id + '_g'">
							<g v-for="macro in state.macroregions.$values" v-bind:key="macro.$id" :id="macro.id + '_g'">
								<g v-for="micro in macro.microregions.$values" v-bind:key="micro.$id" :id="micro.id + '_g'">
									<a v-for="city in micro.municipalities.$values" v-bind:key="city.$id" :id="city.id + '_a'" class="city" @click.prevent="onClickCity" @mouseover="onMouseOverCity" @mouseout="onMouseOutCity" :title="state.name+'|'+city.name">
										<path aria-hidden="true" :id="city.id" :ref="city.id" :itemid="city.$id" :title="city.name" :style="[city.visit?.color ? [{fill: city.visit.color}] : '']" stroke-width="0.5" class="shape" :d="city.canvas"></path>
										<div style="display:none" v-if="city.visit?.color">
											<span class="color">{{city.visit.color}}</span>
											<span class="date">{{city.visit.visitDate.substring(0,10)}}</span>
											<span class="note">{{city.visit.note}}</span>
										</div>
									</a>
									<path :id="micro.id" stroke-width="0.75" :d="micro.canvas"></path>
								</g>
								<g v-for="archipelago in macro.archipelagos.$values" v-bind:key="archipelago.$id" :id="archipelago.id + '_g'">
									<a v-for="island in archipelago.islands.$values" v-bind:key="island.$id" :id="island.id + '_a'" class="city" @click.prevent="onClickCity" @mouseover="onMouseOverCity" @mouseout="onMouseOutCity" :title="state.name+'|'+island.name">
										<path aria-hidden="true" :id="island.id" :ref="island.id" :itemid="island.$id" :title="island.name" :style="[island.visit?.color ? [{fill: island.visit.color}] : '']" stroke-width="0.5" class="shape" :d="island.canvas"></path>
										<div style="display:none" v-if="island.visit?.color">
											<span class="color">{{island.visit.color}}</span>
											<span class="date">{{island.visit.visitDate.substring(0,10)}}</span>
											<span class="note">{{island.visit.note}}</span>
										</div>
									</a>
									<path :id="archipelago.id" stroke-width="0.75" :d="archipelago.canvas"></path>
								</g>
								<path :id="macro.id" stroke-width="1" :d="macro.canvas"></path>
							</g>
							<path :id="state.id" stroke-width="2" :d="state.canvas"></path>
						</g>
					</g>
					<g transform="translate(10,10)" class="map-navigation">
						<g transform="translate(0,47)">
							<g transform="translate(6.166666666666666,1)">
								<path cs="100,100" d="M1.5,33.5 L19.5,33.5" fill="none" stroke-width="1" stroke-opacity="0" stroke="#000000"></path>
								<path cs="100,100" d="M1.5,34.5 L19.5,34.5" fill="none" stroke-width="1" stroke-opacity="0" stroke="#000000"></path>
								<path cs="100,100" d="M1.5,36.5 L19.5,36.5" fill="none" stroke-width="1" stroke-opacity="0" stroke="#000000"></path>
							</g>
							<g cursor="pointer" opacity="0" transform="translate(5,34)">
								<rect x="0.5" y="0.5" width="21" height="2" rx="2" ry="2" stroke-width="1" fill="#FFFFFF" stroke="#000000" fill-opacity="1" stroke-opacity="0.1"></rect>
							</g>
							<g cursor="pointer">
								<circle r="15.5" cx="0" cy="0" fill="#FFFFFF" stroke="#000000" fill-opacity="1" stroke-width="1" stroke-opacity="0.1" transform="translate(16,16)" id="zoomin" @click="onClickZoomIn"></circle>
								<g transform="translate(16,16)" opacity="1" style="pointer-events: none;">
									<path cs="100,100" d="M-6.5,0.5 L7.5,0.5" fill="none" stroke-width="1" stroke-opacity="1" stroke="#000000"></path>
									<path cs="100,100" d="M0.5,-6.5 L0.5,7.5" fill="none" stroke-width="1" stroke-opacity="1" stroke="#000000"></path>
								</g>
							</g>
							<g cursor="pointer" transform="translate(0,36)">
								<circle r="15.5" cx="0" cy="0" fill="#FFFFFF" stroke="#000000" fill-opacity="1" stroke-width="1" stroke-opacity="0.1" transform="translate(16,16)" id="zoomout" @click="onClickZoomOut"></circle>
								<path cs="100,100" d="M-6.5,0.5 L7.5,0.5" fill="none" stroke-width="1" stroke-opacity="1" stroke="#000000" transform="translate(16,16)" opacity="1" style="pointer-events: none;"></path>
							</g>
						</g>
						<g cursor="pointer">
							<circle r="15.5" cx="0" cy="0" fill="#FFFFFF" stroke="#000000" fill-opacity="1" stroke-width="1" stroke-opacity="0.1" transform="translate(16,16)" @click="onClickHome"></circle>
							<path d="M-6.5,0.5 L0.5,-6.5 L7.5,0.5 L6.5,0.5 L6.5,6.5 L2.5,6.5 L2.5,2.5 L-1.5,2.5 L-1.5,6.5 L-5.5,6.5 L-5.5,0.5 Z" fill="#000000" stroke="#000000" fill-opacity="1" stroke-width="1" stroke-opacity="1" transform="translate(16,16)" opacity="1"></path>
						</g>
					</g>
				</svg>
			</div>
		</div>
    </section>
</template>
<script>
    import { ref, reactive} from "vue";
	import http from '@/services/http.js';

    const fileWidth = 4612,
        fileHeight = 4588,
        maxScale = 1.50,
        ratio = 1.2,
        maxRatio = 1.8,
        regexColor = /^#[0-9A-F]{6}$/i,
        javisiteiWidth = 447,
        javisiteiHeight = 293,
		maxTransition = 0.3,
		innerHeightNew = innerHeight-50;
        
	const isPanning = ref(false),
		pathActive = ref(null),
		isClick = ref(true),
		tooltip = ref(null),
		javisitei = ref(null),
		color = ref(null),
		hexcolor = ref(null),
		cityName = ref(null),
		stateName = ref(null),
		annotation = ref(null),
		date = ref(null),
		scale = ref(0.21),
		scaleOriginal = ref(0.21),
		styleTransform = reactive({'transform': 'translate(0px, 0px) scale(0.21)', 'transition': '0s'}),
		translate = reactive({x: 0, y: 0}),
		start = reactive({x: 0, y: 0});
		var user = reactive(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {});
	
  	var citiesSearch = [];
	citiesSearch = JSON.parse(localStorage.getItem('cities'));

	document.addEventListener('contextmenu', (e) => e.preventDefault());

	function handleKeys(e, keyCode) {
		return e.ctrlKey && e.shiftKey && e.keyCode === keyCode.charCodeAt(0);
	}

	document.onkeydown = (e) => {
		if (e.keyCode === 123 || handleKeys(e, 'I') || handleKeys(e, 'J') || handleKeys(e, 'C') || (e.ctrlKey && e.keyCode === 'U'.charCodeAt(0))) return false;
	}

	function handleHome(){
		scale.value = scaleOriginal.value;
		translate.x = 0;
		translate.y = 0;

		setTransform(maxTransition);
	}

	function handleZoom(delta, posX, posY){
		let xs = (posX - translate.x) / scale.value,
			ys = (posY - translate.y) / scale.value;
		
		if(delta != null){
			(delta > 0) ? (scale.value *= ratio) : (scale.value /= ratio);
		}
		else if((scale.value*maxRatio) < maxScale){
			if(scale.value < scaleOriginal.value) scale.value = scaleOriginal.value*maxRatio;
			else scale.value *= maxRatio;
		}
		
		translate.x = posX - xs * scale.value;
		translate.y = posY - ys * scale.value;
		
		setTransform(maxTransition);	
	}
	
	function handleJaVisitei(active, cityDetail, eCity, nameState, posX, posY) {
			
		if(active){
			addPathActive(eCity);
			
			if((posX + javisiteiWidth) > innerWidth) posX = innerWidth - javisiteiWidth;
			if((posY + javisiteiHeight) > innerHeightNew) posY = innerHeightNew - javisiteiHeight;

			if(cityDetail.length > 0) {
				salvar.value = 'Atualizar';
				remover.style = 'display: block';
				setColor(cityDetail[0].getElementsByClassName('color')[0].innerHTML);	
				date.value.value = cityDetail[0].getElementsByClassName('date')[0].innerHTML;
				annotation.value.value = cityDetail[0].getElementsByClassName('note')[0].innerHTML;
			}else{
				salvar.value = 'Pinar';
				remover.style = 'display: none';
				randomColor();
				dateNow();
			}
			
			javisitei.value.style = `display: block; left: ${posX}px; top: ${posY}px;border-color: ${color.value.value}`;
			cityName.value.innerText = eCity.attributes.title.value;
			stateName.value.innerText = nameState;
			search.value = '';
			
		} else cleanJaVisitei();
	}
	
	function themeJaVisitei(hex){
		javisitei.value.attributes.style.borderColor = hex;
		cityName.value.style = `color: ${hex}`;
		stateName.value.style = `color: ${hex}`;
	}
	
	function cleanJaVisitei(){
		removePathActive();
		javisitei.value.style = 'display: none';
		cityName.value.innerText = '';
		stateName.value.innerText = '';
		date.value.value = '';
		color.value.value = '#FFFFFF'
		hexcolor.value.value = '';
		annotation.value.value = '';
	}

	function setTransform(transition){
		styleTransform.transform = `translate(${translate.x}px, ${translate.y}px) scale(${scale.value})`;
		styleTransform.transition = `${transition}s`;
	}

	function removePathActive(){
		if(pathActive.value) pathActive.value.classList.remove('active');
	}
	
	function addPathActive(element){
		element.classList.add('active');
		pathActive.value = element;
	}

	function setColor(hex){
		color.value.value = hex;
		hexcolor.value.value = hex;
		themeJaVisitei(hex);
	}

	function randomColor(){
		let hex = `#${Math.floor(Math.random()*16777215).toString(16)}`;
		setColor(hex);
	}
	
	function dateNow(){
		const today = new Date();
		const yyyy = today.getFullYear();
		let mm = today.getMonth() + 1;
		let dd = today.getDate();

		if (dd < 10) dd = `0${dd}`;
		if (mm < 10) mm = `0${mm}`;

		date.value.value = `${yyyy}-${mm}-${dd}`;
	}

	function autocomplete(inp, arr) {
		let currentFocus;
		
		inp.addEventListener("input", function(e) {
			let a, b, i, eInput, eCity, eCityLink, val = this.value;
			closeAllLists();
			if (!val) return false;
			currentFocus = -1;
			
			a = document.createElement("DIV");
			a.setAttribute("id", this.id + "AutocompleteList");
			a.setAttribute("class", "autocomplete-items");
			this.parentNode.appendChild(a);
			
			for (i = 0; i < arr.length; i++) {
				if (replaceSpecialChars(arr[i].name.substr(0, val.length)) == replaceSpecialChars(val)) {
					let nameFull = `${arr[i].name} - ${arr[i].id.substr(0,2).toUpperCase()}`;
					b = document.createElement("DIV");
					b.innerHTML = nameFull;
					b.innerHTML += "<input type='hidden' value='" + nameFull + "' key='"+arr[i].id+"'>";
					b.addEventListener("click", function(e) {
						eInput = this.getElementsByTagName("input")[0];
						inp.value = eInput.value;
						eCity = document.getElementById(eInput.getAttribute('key'));
						eCityLink = document.getElementById(`${eInput.getAttribute('key')}_a`);
						
						removePathActive(eCity);
						handleJaVisitei(true, eCityLink.getElementsByTagName('div'), eCity, eCityLink.getAttribute('title').split('|')[0], header.offsetLeft+header.offsetWidth/2-javisiteiWidth/2, inp.offsetTop+inp.offsetTop+10);
						closeAllLists();
					});
					a.appendChild(b);
				}
			}
		});
		
		inp.addEventListener("keydown", function(e) {
			var x = document.getElementById(this.id + "AutocompleteList");
			if (x) x = x.getElementsByTagName("div");
			if (e.keyCode == 40) {
				currentFocus++;
				addActive(x);
			} else if (e.keyCode == 38) { 
				currentFocus--;
				addActive(x);
			} else if (e.keyCode == 13) {
				e.preventDefault();
				if (currentFocus > -1 && x) x[currentFocus].click();
			}
		});
		
		function addActive(x) {
			if (!x) return false;
			removeActive(x);
			if (currentFocus >= x.length) currentFocus = 0;
			if (currentFocus < 0) currentFocus = (x.length - 1);
			x[currentFocus].classList.add("autocomplete-active");
		}
		
		function removeActive(x) {
			for (var i = 0; i < x.length; i++) x[i].classList.remove("autocomplete-active");
		}
		
		function closeAllLists(element) {
			var x = document.getElementsByClassName("autocomplete-items");
			for (var i = 0; i < x.length; i++) if (element != x[i] && element != inp) x[i].parentNode.removeChild(x[i]);
		}
		
		document.addEventListener("click", function (e) {
			closeAllLists(e.target);
		});
	}
	
	function replaceSpecialChars(str)
	{
		str = str.replace(/[ÀÁÂÃÄÅ]/,"A");
		str = str.replace(/[àáâãäå]/,"a");
		str = str.replace(/[èéê]/,"e");
		str = str.replace(/[ÈÉÊË]/,"E");
		str = str.replace(/[èéê]/,"e");
		str = str.replace(/[ÒÓÔÕ]/,"O");
		str = str.replace(/[òóôõ]/,"o");
		str = str.replace(/[ÌÍ]/,"I");
		str = str.replace(/[ìí]/,"i");
		str = str.replace(/[ÙÚ]/,"U");
		str = str.replace(/[ùú]/,"u");
		str = str.replace(/[Ç]/,"C");
		str = str.replace(/[ç]/,"c");
		str = str.replace(/[^a-z0-9]/gi,'');
		
		return str.toUpperCase(); 
	}
	
	async function getMunicipalitiesAPI(){
		
		if(citiesSearch != null){
			autocomplete(search, citiesSearch);
		}else{
			await http.get('municipalities/search/bra_brasil')
				.then(function (response) {
					citiesSearch = response.data.$values;
          			Promise.resolve(response.data);
				})
				.catch((error) => {
  					if (error.response || error.response.status != 401) console.log(error);
				})
				.finally(function () {
					localStorage.setItem('cities', JSON.stringify(citiesSearch));
					autocomplete(search, citiesSearch);
				});
		}
  	}

	async function pinarAPI(){
		
		let data = {
  				userId: user.id,
  				regionTypeId: pathActive.value.id.substring(pathActive.value.id.length-6, pathActive.value.id.length) == 'island' ? 7 : 6,
  				regionId: pathActive.value.id,
  				color: convertHexToRGB(color.value.value),
  				visitationDate: date.value.value,
				note: annotation.value.value
			};

		let cityDetail = pathActive.value.parentElement.getElementsByTagName('div');
		if(cityDetail.length > 0) {
			await http.put('visits', data)
				.then((response) => {
					if(response.data){
						cityDetail[0].getElementsByClassName('color')[0].innerHTML = response.data.data.color;
						cityDetail[0].getElementsByClassName('date')[0].innerHTML = response.data.data.visitDate.substring(0,10);
						cityDetail[0].getElementsByClassName('note')[0].innerHTML = response.data.data.note;
					}
          			Promise.resolve(response.data);
					
					if(salvar.value == 'Atualizar' || colorHidden) window.location.reload();
				})
				.catch((error) => {
  					if (!error.response || error.response.status != 401) console.log(error);
				});

		} else {
			
			await http.post('visits', data)
				.then((response) => {
					if(response.data){
						pathActive.value.parentElement.appendChild(document.createElement("div"));
						pathActive.value.parentElement.getElementsByTagName('div')[0].innerHTML = `<span class="color">${response.data.data.color}</span><span class="date">${response.data.data.visitDate.substring(0,10)}</span><span class="note">${response.data.data.note}</span>`;		
					}
          			Promise.resolve(response.data);
				})
				.catch((error) => {
  					if (!error.response || error.response.status != 401) console.log(error);
				});
		}
  	}

	async function deletePinAPI(){

		await http.delete('visits', { data: {
				userId: user.id,
				regionTypeId: pathActive.value.id.substring(pathActive.value.id.length-6, pathActive.value.id.length) == 'island' ? 7 : 6,
				regionId: pathActive.value.id
			}})
			.then((response) => {
          		Promise.resolve(response.data);
			})
			.catch((error) => {
				if (!error.response || error.response.status != 401) console.log(error);
			});
	}
	
	function convertDate(data){
		return `${data.substring(0,4)}-${data.substring(5,7)}-${data.substring(8,10)}`;
	}

	function getMapAPI(map){
		map.brazil = null;
		http.get(`countries/bra_brasil/user/${user.id}/full`)
			.then(response => {
				map.brazil = response.data;
				Promise.resolve(response.data);
			})
			.catch(error => {
				if (!error.response || error.response.status != 401) console.log(error);
				map.errored = true;
				map.$store.dispatch('auth/logout');
				map.$router.push('/login');
			})
			.finally(() => map.loading = false);
	}

	function convertHexToRGB(hex){
		let r = parseInt(hex.substring(1,3), 16);
		let g = parseInt(hex.substring(3,5), 16);
		let b = parseInt(hex.substring(5,7), 16);

		return `${r},${g},${b}`;
	}

	export default {
		setup(){
			return {
				tooltip,
				javisitei,
				hexcolor,
				color,
				cityName,
				stateName,
				date,
				annotation
			}
		},
		computed: {
			currentUser() {
				return this.$store.state.auth.user;
			},
			loggedIn() {
				return this.$store.state.auth.status.loggedIn;
			},
			currentMapBrazil(){
				return true;
			}
		},
		created() {
			if (!this.loggedIn) {
				this.$router.push("/login");
			}

		},
		mounted() {
			
			if(!user) user = JSON.parse(localStorage.getItem('user'));

			scale.value = innerHeightNew < innerWidth ? innerHeightNew/fileHeight : innerWidth/fileWidth;
			scaleOriginal.value = scale.value;

			getMunicipalitiesAPI();
			if(this.$store.state.auth.user)
				user = this.$store.state.auth.user;
			getMapAPI(this);
			handleHome();
		},
		methods: {
			onMouseOverCity($evt){
				tooltip.value.innerText = $evt.target.attributes.title.value;
				tooltip.value.style = 'display:block';

				let top = $evt.clientY - 80;
				let left = $evt.clientX + tooltip.value.clientWidth + 10;
				let style = `top: ${(top < 0 ? 0 : top).toString()}px;left:${(top < 0 ? $evt.clientX + 10 : $evt.clientX).toString()}px;display:block`;

				if(left > innerWidth){
					style = `top:${(top < 0 ? ($evt.clientY - 10 - tooltip.value.clientHeight).toString() : top).toString()}px;left:${($evt.clientX-(left-innerWidth)).toString()}px;display:block;`;
				}
				tooltip.value.style = style;
			},
			onMouseOutCity(){
				tooltip.value.style = 'display:none';
			},
			onClickCity($evt){
				if(isClick.value){
					removePathActive();
					handleJaVisitei(true, $evt.target.parentElement.getElementsByTagName('div'), $evt.target, $evt.target.parentElement.attributes.title.value.split('|')[0], $evt.clientX, $evt.clientY);
				}
			},
			onClickHome(){
				handleHome();
			},
			onClickZoomIn(){
				handleZoom(1, innerWidth/2, innerHeightNew/2);	
			},
			onClickZoomOut(){
				handleZoom(0, innerWidth/2, innerHeightNew/2);
			},
			onClickCloseJavisitei(){
				cleanJaVisitei();
			},
			onClickPinar(){
				if(pathActive.value){
					pathActive.value.style = `fill: ${color.value.value}`;
					let colorHidden = pathActive.value.classList.value.includes('colorHidden');
					
					removePathActive();
					pathActive.value.classList.remove('colorHidden');
					pinarAPI();
				}
				cleanJaVisitei();
			},
			onClickPinRemove(){
				if(pathActive.value){
					pathActive.value.style = '';
					pathActive.value.classList.add('colorHidden');
					let parent = pathActive.value.parentElement;
					parent.removeChild(parent.getElementsByTagName('div')[0]);

					deletePinAPI();
				}
				cleanJaVisitei();
			},
			onChangeHexcolor(){
				if(regexColor.test(hexcolor.value.value)){
					color.value.value = hexcolor.value.value;
					themeJaVisitei(hexcolor.value.value);
				}
			},
			onChangeColor(){
				hexcolor.value.value = color.value.value;
				themeJaVisitei(color.value.value);
			},
			onWheelMain($evt){
				let delta = ($evt.wheelDelta ? $evt.wheelDelta : -$evt.deltaY);
				handleZoom(delta, $evt.clientX, $evt.clientY);
			},
			onMouseDownMain($evt){
				start.x = $evt.clientX - translate.x;
				start.y = $evt.clientY - translate.y;
				isPanning.value = true;
			},
			onMouseUpMain(){
				isPanning.value = false;
			},
			onMouseMoveMain($evt){

				isClick.value = true;
				
				if (!isPanning.value) return;
				
				isClick.value = false;
				
				let posX = ($evt.clientX - start.x);
				let posY = ($evt.clientY - start.y);
				
				if(posX > innerWidth || posX < fileWidth*scale.value*-1){
					handleHome();
					return;
				}
				
				if(posY > innerHeightNew || posY < fileHeight*scale.value*-1){
					handleHome();
					return;
				}
				
				translate.x = posX;	
				translate.y = posY
				
				setTransform(0);
			}
		},
		data(){
			return{
				scale,
				styleTransform,
				scaleOriginal,
				fileHeight,
				fileWidth,
				translate,
				innerWidth,
				innerHeightNew,
				maxTransition,
				tooltip,
				javisitei,
				hexcolor,
				color,
				cityName,
				stateName,
				date,
				annotation,
				brazil: null,
      			loading: true,
				errored: false
			}
		}
	}
		
</script>

<style lang="scss" scoped>
		
		path{
			fill: none;
			stroke:#000000;
		}
		
		#map {
			display: block;
			margin: 0 auto;
			stroke-width:0.3; 
			position:relative;
		}
		
		#map .macro {
			stroke-width:0.2;
			stroke:#666;
		}
		
		#map .micro {
			stroke-width:0.15;
		}
		
		#map .city {
			cursor: pointer;
			stroke-width:0.1;
			position:relative;
		}
		
		#map .city .shape {
			cursor: pointer;
		}
		
		#map .city .lbl_city {
			display: none;
			font-family: Arial;
			font-size: 14px;
			line-height: 16px;
			font-weight: bold;
			position: absolute;
		}
		
		#map .city:hover .lbl_city {
			display: block;
			cursor: pointer;
		}
		
		#map .map-g .city .shape {
			fill: #fff;
		}
		
		#map .map-g .city .lbl_city {
			fill: #666;
			display: none;
		}
		
		#map .map-g .city:hover .shape, #map .map-g .city.hover .shape {
			fill: rgba(0, 127, 255, 0.8) !important;
			stroke-width: .75;
		}
		
		#map .map-g .city .active{
			fill: #2dffb2;
		}

		#tooltip{
			position:absolute;font-size: 1em;color:#000;display:none;border:1px solid #d5d5d5;z-index:999;background:#f5f5f5;padding:0 5px 1px 5px;border-radius: 2px;box-shadow: 1px 1px 2px rgba(0,0,0,.1);
		}
		
		a{
			display:block
		}

		#search {
			padding:8px 10px 5px 10px;width:50%;left: 25%;position:relative;margin-bottom:0;
		}
		
		
		#map .map-g {
			border:1px solid #000000;
			stroke:#000000;
			transform: scale(0.2);
		}
		.map-navigation{
			z-index: 9999;
		}
		
		#main {
			width: 100%;
			height: 100%;
		}
		
		#mapg {
			width: 100%;
			height: 100%;
			transform: translate(0px, 0px) scale(0.21);
		}
		
		#javisitei{
			position:absolute;
			background:#fff;
			z-index:999;
			border: 1px solid #f5f;
			padding: 5px 10px 10px;
			color: #000;
			border-radius: 5px;
			box-shadow: 1px 1px 3px rgba(0,0,0,.3);
			width: 422px;
			height:273px;
		}
		#javisitei h3,#javisitei h2{
			margin:0;padding:5px 0 0
		}
		#javisitei h3{
			font-size:1.4em;
		}
		#javisitei h2{
			font-size:0.8em;
		}
		
		#javisitei .block-1,
		#javisitei .block-2{
			height: 150px;
		}
		#javisitei .block-1{
			margin: 0;
			float:left;
		}
		
		#javisitei .block-2{
			width: 142px;
			float:right;
		}
		
		#javisitei label{
			height:20px;
			padding: 10px 0 0;
		}
		
		#javisitei input{
			float:right;
		}
		
		#javisitei input[type="button"]{background:#f1f1f1}
		#javisitei input[type="button"]:hover{background:#f3f3f3}
		#javisitei textarea{
			width: 239px;
			margin: 10px 0 0 10px;
			height: 138px;
			font-size: 16px;
		}
		
		#color{
			padding: 1px;
			width: 60px;
			height: 35px;
		}
		
		#javisitei #salvar,#javisitei #remover{
			float:left;
		}
		
		#javisitei #hexcolor{
			width:90px;
		}
		
		#javisitei input,#javisitei textarea{
			background:#fff;
			border:1px #333 solid;
		}
		#javisitei #date{
			width: 122px;
			padding: 5px 4px;
			font-size: 100%;
		}
		
		#javisitei #date, 
		#javisitei #hexcolor{
			height: 30px;
			line-height: 30px;
		}
		
		#javisitei #closeJavisitei {
			position: absolute;
			right: 0;
			top: 4px;
			color: red;
			border:none;
			font-size:600;
			cursor: pointer;
			z-index:999;
			background:none
		}

		.colorHidden{
			fill:#fff!important;
		}
		
		#loader{
			width:100%;
			height:100%;
			background: rgb(0 0 0 / 20%);
			position: absolute;
			z-index: 9;
		}
		
		#loader div {
			border: 16px solid #f3f3f3;
			border-top: 16px solid #3498db;
			border-radius: 50%;
			width: 100px;
			height: 100px;
			margin: -66px 0 0 -66px;
			animation: spin 2s linear infinite;
			-webkit-animation: spin 2s linear infinite;
			position:absolute;
			top:50%;
			left:50%;
		}

		@keyframes spin {
			0% { transform: rotate(0deg); }
			100% { transform: rotate(360deg); }
		}

		@keyframes spin {
			0% { transform: rotate(0deg); }
			100% { transform: rotate(360deg); }
		}
		
</style>