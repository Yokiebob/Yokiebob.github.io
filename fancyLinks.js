const elements_with_flag = document.getElementsByClassName('niceLinkFormat');
for(var i = 0; i < elements_with_flag.length; i++){
	const curr = elements_with_flag[i];
	
	var currText = curr.innerHTML;
	currText = currText.split("/");
	for(var k = 0; k < currText.length; k++){
		const gotoLink = currText.slice(0,k + 1).join("/");
		currText[k] = `<a href = ${"https://yokiebob.github.io/" + gotoLink.toLowerCase=="yokiebob"?"":gotoLink}> ${currText[k]} </a>`;
	}
	curr.innerHTML = "";
	for(var k = 0; k < currText.length; k++){
		curr.innerHTML += currText[k];
	}
}
