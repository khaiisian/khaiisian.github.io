let show_cart = document.querySelector('.cart_icon');
let _body = document.querySelector('body');
let hide_cart = document.querySelector('.cancel');
let item_grid = document.querySelector('.product_grid');
let addtocart = document.querySelector('.add-to-cart');
let cart_list = document.querySelector('.cart-list');
let Qty = document.querySelector('.amount');


// for (let i = 0; i < addtocart.length; i++) {                     (Unable to catch all the btns (may be bcus they are created with js code ?))
//     console.log(addtocart.length);
// }

//Arrays
cart_items = []
items_lst_js = []

show_cart.addEventListener('click', function(){
    _body.classList.toggle('show-cart');
});

hide_cart.addEventListener('click', ()=>{
    _body.classList.toggle('show-cart')
})

// Diplaying all items from items.json
const addItem = () =>{
    item_grid.innerHTML = '';  // make the item that is already in the html empty or refresh
    if (items_lst_js.length>0){
        items_lst_js.forEach(item => {
            let new_item = document.createElement('div');
            new_item.classList.add('item')
            new_item.dataset.id = item.id;    //set dataset.id for the "item" div
            new_item.innerHTML = `
                <img src="${item.img}" alt="item-1">
                <div class="item-name">${item.name}</div>
                <div class="price">$${item.price}</div>
                <button class="add-to-cart">Add to cart 
                    <span><svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.3L19 7H7.3"/>
                  </svg></span>
                </button>`;
                item_grid.appendChild(new_item);
        });
    }
}

// addtocart.addEventListener('click', function(){      (Failed (may be the click can be catched with eventlistner for only content that are in html ?))
//     alert('1');
// });


//Add to cart click event
item_grid.addEventListener('click', point =>{
    let clickedPoint = point.target;
    // finding if the clicked element has class name "add-to-cart"
    if (clickedPoint.classList.contains('add-to-cart')){
        let item_id = clickedPoint.parentElement.dataset.id;
        add_cart_item(item_id)
    } 
})

cart_list.addEventListener('click', (point)=>{
    let clickedPoint = point.target;
    if(clickedPoint.classList.contains("plus") || clickedPoint.classList.contains("minus")){
        let cartItemId = clickedPoint.parentElement.parentElement.dataset.id;
        let sign = 'minus';
        if(clickedPoint.classList.contains("plus")){
            sign = 'plus'
            console.log("plus")
        }
        chgQty(cartItemId, sign);
    }
})

const chgQty=(cartItemId, sign)=>{
    let cartItemIndex = cart_items.findIndex(item => item.item_id == cartItemId)
    if (cartItemIndex>=0){
        switch(sign){
            case "plus":
                cart_items[cartItemIndex].quantity = cart_items[cartItemIndex].quantity+ 1;
                break;
            default:
                let qty = cart_items[cartItemIndex].quantity - 1;
                if (qty>0){
                    cart_items[cartItemIndex].quantity = qty
                }
                else{
                    cart_items.splice(cartItemIndex, 1);
                }
                break;
        }
    }
    addCartList();
    constantCartList();
}
const add_cart_item = (item_id)  => {
    let cartItemPosition = cart_items.findIndex(value => value.item_id === item_id)
    if(cart_items.length <=0){
        cart_items = [{
            item_id: item_id,
            quantity: 1
        }]
    }
    else if (cartItemPosition < 0){
        cart_items.push ({
            item_id: item_id,
            quantity: 1
        })
    }
    else {
        cart_items[cartItemPosition].quantity +=1;
    }
    addCartList();
    constantCartList();
    // console.log(cart_items)
}
const constantCartList = () =>{
    localStorage.setItem('cart_items', JSON.stringify(cart_items))
}


const addCartList = () =>{
    cart_list.innerHTML = '';
    let totalQty =0;
    if (cart_items.length>0){
        cart_items.forEach(item => {
            let cartDiv = document.createElement('div');
            cartDiv.classList.add('cart-item');
            cartDiv.dataset.id = item.item_id;
            let item_list_index = items_lst_js.findIndex(value => value.id == item.item_id);
            let item_detail = items_lst_js[item_list_index]

            totalQty = totalQty + item.quantity;
            // console.log("index", item_list_index)
            // console.log(item.item_id)

            cartDiv.innerHTML = `
            <img src="${item_detail.img}" alt=>
            <span class="item-detail">${item_detail.name}</span>
            <div class="item-qty">
                <span class="minus">-</span>
                <span class="qty">${item.quantity}</span>
                <span class="plus">+</span>
            </div>
            <div class="remove">
                <button class="remove-btn">Remove</button>
            </div>`
            cart_list.appendChild(cartDiv)

            //for total item qty in cart
            Qty.innerText = totalQty;
            
        })
        
    }
    
}





const load_js = ()=>{                  //load_js = funtion() 
    // localStorage.removeItem('cart_items');
    fetch("items.json")
    .then(response => response.json())   //return response.json
    .then(data =>{
        (items_lst_js = data);
        addItem();
        if(localStorage.getItem('cart_items')){
            cart_items = JSON.parse(localStorage.getItem('cart_items'));
            addCartList();
        }

        
    })

}
load_js()

