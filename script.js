const foods=[
{id:1,name:"Margherita Pizza",category:"Pizza",price:299,diet:"Veg",emoji:"🍕",desc:"Classic tomato, mozzarella and basil."},
{id:2,name:"Chicken Burger",category:"Burgers",price:249,diet:"Non-Veg",emoji:"🍔",desc:"Juicy chicken patty with fresh lettuce."},
{id:3,name:"Paneer Tikka",category:"Indian",price:229,diet:"Veg",emoji:"🍢",desc:"Smoky paneer with Indian spices."},
{id:4,name:"Veg Biryani",category:"Indian",price:199,diet:"Veg",emoji:"🍛",desc:"Aromatic rice with vegetables and herbs."},
{id:5,name:"Hakka Noodles",category:"Asian",price:179,diet:"Veg",emoji:"🍜",desc:"Wok-tossed noodles with crunchy vegetables."},
{id:6,name:"Butter Chicken",category:"Indian",price:329,diet:"Non-Veg",emoji:"🍗",desc:"Creamy tomato gravy with tender chicken."},
{id:7,name:"Chocolate Cake",category:"Dessert",price:149,diet:"Veg",emoji:"🍰",desc:"Rich, soft chocolate cake with ganache."},
{id:8,name:"Cheese Pasta",category:"Pizza",price:219,diet:"Veg",emoji:"🍝",desc:"Creamy cheesy pasta with herbs."},
{id:9,name:"Fish Burger",category:"Burgers",price:279,diet:"Non-Veg",emoji:"🐟",desc:"Crispy fish fillet with fresh toppings."}
];
let cart=JSON.parse(localStorage.getItem("freshbiteCart")||"[]");
const foodGrid=document.getElementById("foodGrid"),cartItems=document.getElementById("cartItems"),cartSummary=document.getElementById("cartSummary"),cartCount=document.getElementById("cartCount"),checkoutTotal=document.getElementById("checkoutTotal"),toast=document.getElementById("toast");

function money(n){return "₹"+n.toLocaleString("en-IN")}
function save(){localStorage.setItem("freshbiteCart",JSON.stringify(cart))}
function showToast(msg){toast.textContent=msg;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),2200)}
function renderFoods(cat="All",diet="All"){
 let list=foods.filter(f=>(cat==="All"||f.category===cat)&&(diet==="All"||f.diet===diet));
 foodGrid.innerHTML=list.map(f=>`<article class="food-card"><div class="food-img">${f.emoji}</div><div class="food-body"><h3>${f.name}</h3><p class="desc">${f.desc}</p><div class="price">${money(f.price)}</div><span class="tag ${f.diet==="Non-Veg"?"non":""}">${f.diet}</span><button class="btn primary add" onclick="addToCart(${f.id})">Add to Cart</button></div></article>`).join("");
}
function addToCart(id){let x=cart.find(i=>i.id===id);if(x)x.qty++;else cart.push({id,qty:1});save();renderCart();showToast("Added to cart 🛒")}
function changeQty(id,d){let x=cart.find(i=>i.id===id);if(!x)return;x.qty+=d;if(x.qty<=0)cart=cart.filter(i=>i.id!==id);save();renderCart()}
function renderCart(){
 cartCount.textContent=cart.reduce((s,x)=>s+x.qty,0);
 if(!cart.length){cartItems.innerHTML='<div class="summary"><h3>Your cart is empty</h3><p style="font-size:12px;color:#806e63">Add some delicious food from the menu.</p><br><a class="btn primary" href="#menu">Browse Menu</a></div>';cartSummary.innerHTML="";checkoutTotal.textContent="Total: ₹0";return}
 let subtotal=cart.reduce((s,x)=>{let f=foods.find(f=>f.id===x.id);return s+f.price*x.qty},0),delivery=subtotal>=499?0:40,total=subtotal+delivery;
 cartItems.innerHTML=cart.map(x=>{let f=foods.find(f=>f.id===x.id);return `<div class="cart-item"><div class="cart-thumb">${f.emoji}</div><div><h4>${f.name}</h4><p>${money(f.price)}</p></div><div class="qty"><button onclick="changeQty(${f.id},-1)">−</button><b>${x.qty}</b><button onclick="changeQty(${f.id},1)">+</button></div></div>`}).join("");
 cartSummary.innerHTML=`<h3>Order Summary</h3><div class="sum-row"><span>Subtotal</span><b>${money(subtotal)}</b></div><div class="sum-row"><span>Delivery</span><b>${delivery?money(delivery):"FREE"}</b></div><div class="sum-row total"><span>Total</span><b>${money(total)}</b></div><br><a class="btn primary full" href="#checkout">Proceed to Checkout</a>`;
 checkoutTotal.textContent=`Total to pay: ${money(total)}`;
}
document.querySelectorAll(".category").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".category").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderFoods(b.dataset.cat,document.getElementById("dietFilter").value)}));
document.getElementById("dietFilter").addEventListener("change",e=>{let active=document.querySelector(".category.active").dataset.cat;renderFoods(active,e.target.value)});
document.getElementById("menuToggle").addEventListener("click",()=>document.getElementById("navLinks").classList.toggle("open"));
document.querySelectorAll("nav a").forEach(a=>a.addEventListener("click",()=>document.getElementById("navLinks").classList.remove("open")));
document.querySelectorAll(".tab").forEach(t=>t.addEventListener("click",()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));t.classList.add("active");document.querySelectorAll(".account-form").forEach(x=>x.classList.add("hidden"));document.getElementById(t.dataset.tab).classList.remove("hidden")}));
document.getElementById("checkoutForm").addEventListener("submit",e=>{e.preventDefault();if(!cart.length){showToast("Your cart is empty");return}let order="FB"+Date.now().toString().slice(-6);cart=[];save();renderCart();e.target.reset();showToast("Order placed successfully! #"+order)});
document.getElementById("login").addEventListener("submit",e=>{e.preventDefault();showToast("Login simulated successfully")});
document.getElementById("register").addEventListener("submit",e=>{e.preventDefault();showToast("Account created successfully")});
document.getElementById("contactForm").addEventListener("submit",e=>{e.preventDefault();e.target.reset();showToast("Message sent successfully")});
renderFoods();renderCart();
