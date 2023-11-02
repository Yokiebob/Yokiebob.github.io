const elements_with_flag = document.getElementsByClassName('niceLinkFormat');
for(var i = 0; i < elements_with_flag.length; i++){
	const curr = elements_with_flag[i];
	
	var currText = curr.innerHTML;
	currText.split("/");
	currText.splice(0,1);
	for(var k = 0; k < currText.length; k++){
		const gotoLink = currText.slice(0,k + 1).join("/");
		currText[k] = `<a href = ${"https://yokiebob.github.io/" + gotoLink}></a>`;
	}
	curr.innerHTML = currText.join("");
}
