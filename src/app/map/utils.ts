export const loadImage = (jwtToken, imgElement, src) => {
  const client = new XMLHttpRequest();
  client.open('GET', src);
  client.responseType = 'arraybuffer';
  client.setRequestHeader('Accept', 'image/png');
  client.setRequestHeader('Authorization', jwtToken);
  client.onload = function() {
    const blob = this.response;
    const str = btoa(String.fromCharCode.apply(null, new Uint8Array(blob)));
    const data = 'data:image/png;base64,' + str;
    imgElement.src = data;
  };
  client.send();
}

export const loadTiles = (jwtToken, imageTile, src) =>
  loadImage(jwtToken, imageTile.getImage(), src);
