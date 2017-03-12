const tooltip = ({ title, address, type, since }) => (`
  <div class='p1 h5' style='width:300px'>
    <div class='h4 bold'>${title}</div>
    <div class='mb1'>${address}</div>
    <button type="button" class="btn btn-small btn-primary bg-green mb1">Complete</button>
  </div>
`)

export { tooltip }