const list = document.querySelector('.list-container') 
const toggler = document.querySelector('.toggler') 
const closeMenu = document.querySelector('.close-mobile-menu')
const categories = document.querySelector('#categories')
const categoriesList = document.querySelector('.categories-list')
const navItems = Array.from(document.querySelectorAll('nav li'))

navItems.forEach((item)=>{
  item.addEventListener('click',()=>{
    let section = document.querySelector(`#${item.innerText.toLowerCase().replace(' ','-')}`)
    section.scrollIntoView({
      behavior:'smooth'
    })
  })
})
categories.addEventListener('mouseover',()=>{
    categoriesList.style.opacity="1";
})

categories.addEventListener('mouseout',()=>{
  categoriesList.style.opacity="0";
})

toggler.addEventListener('click',()=>{
  if(list.classList.contains('menu-slide-in')){
    list.classList.remove('menu-slide-in')
    return list.classList.add('menu-slide-out')
 } 
  list.classList.remove('menu-slide-out')
  return  list.classList.add('menu-slide-in') 
 })

closeMenu.addEventListener('click',()=>{
  list.classList.remove('menu-slide-in')
  list.classList.add('menu-slide-out') 
})


