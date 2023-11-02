const elements_with_flag = document.getElementsByClassName('niceLinkFormat');
for(var i = 0; i < elements_with_flag.length; i++){
	const curr = elements_with_flag[i];
	
	var currText = curr.innerHTML;
	currText = currText.split("/");
	curr.innerHTML = "";
	
	for(var k = 0; k < currText.length; k++){
		const gotoLink = currText.slice(0,k + 1).join("/").replace("Yokiebob/","");
		console.log(currText[k]);
		curr.innerHTML += `<a href = "${"https://yokiebob.github.io/" + (currText[k] == "Yokiebob" ? "" : gotoLink)}"> ${currText[k]} </a>`;
	}
}
