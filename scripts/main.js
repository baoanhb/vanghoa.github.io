
function datten(){
	let tentoi = prompt('nhap ten vao');
	if (tentoi) {
	document.querySelector('h1').textContent = 'Mr ' + tentoi;
	}
}

document.querySelector('h1').addEventListener('click', datten);