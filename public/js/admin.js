const deleteProduct = (btn) =>{
  const prodId = btn.parentNode.querySelector("[name = productId]").value;
  const prodElement = btn.parentNode.parentNode.parentNode.parentNode;
  fetch("/admin/delete-product/" + prodId,{
      method: "DELETE"
  }).then(result =>{
      return result.json()
  }).then(data => {
      console.log(data);
      prodElement.parentNode.removeChild(prodElement);
  }).catch(err => {
      console.log(err);
  })
}