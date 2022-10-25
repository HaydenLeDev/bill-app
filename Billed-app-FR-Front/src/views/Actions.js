import eyeBlueIcon from "../assets/svg/eye_blue.js"
import downloadBlueIcon from "../assets/svg/download_blue.js"

var nbBill = 0

export default (billUrl) => {
  nbBill++;
  return (
    `<div class="icon-actions">
      <div id="eye" data-testid="icon-eye${nbBill}" data-bill-url=${billUrl}>
      ${eyeBlueIcon}
      </div>
    </div>`
  )
}