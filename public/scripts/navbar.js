document.addEventListener("DOMContentLoaded", () => {
    const menuItems = [
        {
            text: "Incio",
            href: "#top",
            icon: "home",
            active: true
        },
        {
            text: "Sobre la API",
            href: "#sobre-la-api",
            icon: "sobre-la-api",
            active: false
        },
        {
            text: "Endpoints",
            href: "#endpoints",
            icon: "endpoints",
            active: false
        },
        {
            text: "Cómo acceder a los Endpoints",
            href: "#como-acceder",
            icon: "como-acceder-a-los-endpoints",
            active: false
        },
        {
            text: "Proyecto Final",
            href: "#presentacion-final",
            icon: "",
            active: false
        },
        {
            text: "Footer",
            href: "#footer",
            icon: "trabajo-practico-de-aplicaciones-hibridas",
            active: false
        },
    ]

    // Criar la Nav Container
    const navContainer = document.createElement("div");
    navContainer.id = "navContainer";

    //Crio el simbolico del logo para el fondo
    const backgroundLogo = document.createElement("div");
    backgroundLogo.id = "backgroundLogo";
    navContainer.appendChild(backgroundLogo);

    // Crio el centro de la nav
    const navBar = document.createElement("nav");
    navBar.id = "sideNav";
    navContainer.appendChild(navBar);



    // Criar las listas de links
    menuItems.forEach(item => {
        const link = document.createElement("a");
        link.innerText = item.text;
        link.href = item.href;
        if(item.active) link.classList.add("active");
        navBar.appendChild(link);
    });

    //add en la body
    document.body.appendChild(navContainer);

});