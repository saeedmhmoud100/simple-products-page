let products = [
    {product_name:'Gold Coin',product_price:'112.55',product_image:"assets/images/product.png",added_to_cart:false},
    {product_name:'Gold Coin',product_price:'112.55',product_image:"assets/images/labtop.png",added_to_cart:false},
    {product_name:'Gold Coin',product_price:'112.55',product_image:"assets/images/laptops.png",added_to_cart:false},
    {product_name:'Gold Coin',product_price:'112.55',product_image:"assets/images/mobile.png",added_to_cart:false},
    {product_name:'Gold Coin',product_price:'112.55',product_image:"assets/images/prod1.png",added_to_cart:false},
    {product_name:'Gold Coin',product_price:'112.55',product_image:"assets/images/product.png",added_to_cart:false}
]

window.onload= _ =>{
    if(!localStorage.getItem('products')){
        localStorage.setItem('products',JSON.stringify(products))
    }else{
        products = JSON.parse(localStorage.getItem('products'))
    }
    reRender()
}


const localData = data =>{
    if(data){
        localStorage.setItem('products',JSON.stringify(data))
    }
    if(JSON.parse(localStorage.getItem('products'))){
        return JSON.parse(localStorage.getItem('products'))
    }
    return products
}

const cart_product_numper= _ =>{
    const ul = document.getElementById('nav_ul')
    ul.children[3].remove()
    const li = document.createElement('li')
    li.append(document.createTextNode('Cart'))
    const span = document.createElement('span')
    span.append(document.createTextNode(`${localData().filter(item => item.added_to_cart===true).length}`))
    li.appendChild(span)
    li.addEventListener('click',_=>document.getElementById('cart').classList.toggle('hide'))
    ul.appendChild(li)
}


const handleButtonClick = index =>{
    let prod = localData()
    prod[index].added_to_cart = !prod[index].added_to_cart
    localData(prod)
    reRender()
}

let quickViewData = null
let quickViewId = null;
const handleQuickView = (data,i) =>{
    const product = productCard(data,i,true)
    const container = document.createElement('div')
    container.setAttribute('class','container quick_view_container')
    container.setAttribute('id', `quick_view-${i}`)
    container.appendChild(product)
    document.body.appendChild(container)
    quickViewData=data
    quickViewId=i
}



// one Product
const productCard = (data,index,quickView=false,cart=false) =>{
    const mainContainer = document.createElement('div')
    mainContainer.setAttribute('class','product_card')
    const productImg = document.createElement('img')
    productImg.setAttribute('src',data.product_image)
    mainContainer.appendChild(productImg)

    const productText = document.createElement('div')
    productText.setAttribute('class','product_text')
    const div = document.createElement('div')
    const h3 = document.createElement('h3') //title
    h3.append(document.createTextNode(data.product_name))
    const span = document.createElement('span') //price
    span.append(document.createTextNode(data.product_price))

    div.appendChild(h3)
    div.appendChild(span)
    productText.appendChild(div)
    const button = document.createElement('button')
    button.append(document.createTextNode(`${data.added_to_cart ? 'remove from cart' : 'add to cart'}`))
    const buttons_div = document.createElement('div')
    if(!cart){
        const button2 = document.createElement('button')
        if(quickView){
            button2.addEventListener('click',_ => document.getElementById(`quick_view-${index}`).remove())
            button2.append(document.createTextNode('Close'))
        }else{
            button2.addEventListener('click',_ => handleQuickView(data,index))
            button2.append(document.createTextNode('quick_view'))
        }
        buttons_div.appendChild(button2)
    }else{
        button.style.margin = 'auto'
    }

    button.addEventListener('click',_ => handleButtonClick(index))



    buttons_div.appendChild(button)

    productText.appendChild(buttons_div)

    mainContainer.appendChild(productText)

    return mainContainer
}

// All Products Container
const productContainer = _ =>{
    const container = document.createElement('div')
    container.setAttribute('class','products_container')

    localData().map((item,i) => container.appendChild(productCard(item,i)))
    const products_container = document.getElementById('products_container')
    if(products_container.children[0]){

        products_container.children[0].remove()
    }

    products_container.appendChild(container)
    return container
}


productContainer()

const cart = _ =>{
    const cart_products = localData().map((item,i) => ({...item,id:i})).filter(item => item.added_to_cart===true)
    const container = document.createElement('div')

    cart_products.map((item,i) => container.appendChild(productCard(item,item.id,false,true)))
    container.setAttribute('class','container cart_container')
    container.setAttribute('id', "cart_container")

    if(container){
        document.getElementById('cart_container').remove()
        document.getElementById('cart').appendChild(container)
    }
}



const reRender = _ =>{
    productContainer()
    cart_product_numper()
    cart()
    if(document.body.lastChild.classList.value === 'container quick_view_container'){
        document.body.lastChild.remove()
        handleQuickView({...quickViewData,added_to_cart:!quickViewData.added_to_cart},quickViewId)
        console.log(quickViewData)
    }

}