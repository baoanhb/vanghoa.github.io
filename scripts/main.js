let tencuatoi = document.querySelector('p');
tencuatoi.textContent = 'xin chao gud morning';


function datten(){
	let tentoi = prompt('nhap ten vao');
	if (tentoi) {
	document.querySelector('h1').textContent = 'Mr ' + tentoi;
	} else { 
	datten(); 
	}
}

document.querySelector('h1').addEventListener('click', datten);