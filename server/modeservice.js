var VarMode = 'ON';

function changeMode() {
  if (VarMode == 'ON') {
     VarMode = 'OFF';
   } else {
     VarMode = 'ON';
   }
}

function getMode() {
  return VarMode;
}
module.exports = {
  changeMode: changeMode,
  getMode: getMode,
}
