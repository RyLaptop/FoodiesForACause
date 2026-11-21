// Foodies For A Cause - English / Spanish switcher.
// Translates every text node, placeholder, alt, title and aria-label in place, including
// text that scripts add later (a MutationObserver re-runs it). Choice is saved in localStorage.
// To fix or add a translation: edit DICT below (key = exact English text, whitespace collapsed).
(function () {
  "use strict";

  var DICT = {
    // ---- navigation / footer / shared ----
    "Skip to main content": "Saltar al contenido principal",
    "Toggle menu": "Mostrar u ocultar menú",
    "Home": "Inicio", "Meetings": "Reuniones", "Events": "Eventos", "Officers": "Directiva",
    "Contact": "Contacto", "Donate": "Donar", "Calendar": "Calendario", "Explore": "Explorar",
    "More": "Más", "Fundraisers": "Recaudaciones de fondos", "Service Events": "Eventos de servicio",
    "Social Events": "Eventos sociales", "Food Drives": "Colectas de alimentos", "Feed The Valley": "Feed The Valley",
    "Membership": "Membresía", "Become a Member": "Hazte miembro", "Support Us": "Apóyanos",
    "Foodies For A Cause": "Foodies For A Cause",
    "Foodies For A Cause logo": "Logotipo de Foodies For A Cause",
    "Texas A&M · Since 2025": "Texas A&M · Desde 2025",
    "Instagram": "Instagram",
    "© 2026 Foodies For A Cause, a 501(c)(3) nonprofit organization (EIN 42-4448383). All rights reserved.":
      "© 2026 Foodies For A Cause, una organización sin fines de lucro 501(c)(3) (EIN 42-4448383). Todos los derechos reservados.",
    "Foodies For A Cause | FFAC": "Foodies For A Cause | FFAC",

    // ---- page titles ----
    "Bake Sale at Bottlecap Alley | Foodies For A Cause": "Venta de pasteles en Bottlecap Alley | Foodies For A Cause",
    "Brazos Valley Food Bank | Foodies For A Cause": "Banco de Alimentos del Valle de Brazos | Foodies For A Cause",
    "Calendar | Foodies For A Cause": "Calendario | Foodies For A Cause",
    "Contact | Foodies For A Cause": "Contacto | Foodies For A Cause",
    "Donate | Foodies For A Cause": "Donar | Foodies For A Cause",
    "Feed The Valley | Foodies For A Cause": "Feed The Valley | Foodies For A Cause",
    "Feed The Valley: Associate Screener | Foodies For A Cause": "Feed The Valley: Evaluador asociado | Foodies For A Cause",
    "Feed The Valley: Cooking | Foodies For A Cause": "Feed The Valley: Cocina | Foodies For A Cause",
    "Feed The Valley: Food Handout | Foodies For A Cause": "Feed The Valley: Reparto de comida | Foodies For A Cause",
    "First Friday | Foodies For A Cause": "First Friday | Foodies For A Cause",
    "Food Drives | Foodies For A Cause": "Colectas de alimentos | Foodies For A Cause",
    "Fundraisers | Foodies For A Cause": "Recaudaciones de fondos | Foodies For A Cause",
    "Manage My Sign-Up | Foodies For A Cause": "Administrar mi inscripción | Foodies For A Cause",
    "Meetings | Foodies For A Cause": "Reuniones | Foodies For A Cause",
    "Membership | Foodies For A Cause": "Membresía | Foodies For A Cause",
    "Officer Login | Foodies For A Cause": "Acceso de la directiva | Foodies For A Cause",
    "Officers | Foodies For A Cause": "Directiva | Foodies For A Cause",
    "Service Events | Foodies For A Cause": "Eventos de servicio | Foodies For A Cause",
    "Social Events | Foodies For A Cause": "Eventos sociales | Foodies For A Cause",

    // ---- home ----
    "Service First, Food Always": "Primero el servicio, siempre la comida",
    "Food is service. Food is community.": "La comida es servicio. La comida es comunidad.",
    "A social service organization at Texas A&M. We volunteer with food banks, throw potlucks and cookouts, and celebrate food through history, science, and culture.":
      "Una organización de servicio social en Texas A&M. Somos voluntarios en bancos de alimentos, organizamos comidas compartidas y parrilladas, y celebramos la comida a través de la historia, la ciencia y la cultura.",
    "Foodies For A Cause is a social service organization at Texas A&M built around food: volunteering with local food banks, raising money for hunger-relief organizations, and learning what food means across culture, history, and science.":
      "Foodies For A Cause es una organización de servicio social en Texas A&M centrada en la comida: somos voluntarios en bancos de alimentos locales, recaudamos fondos para organizaciones contra el hambre y aprendemos lo que significa la comida en la cultura, la historia y la ciencia.",
    "FFAC pairs hands-on service with a love of food. We volunteer, fundraise, and learn. Then we get together to enjoy the thing that brought us here in the first place.":
      "FFAC une el servicio práctico con el amor por la comida. Somos voluntarios, recaudamos fondos y aprendemos. Después nos reunimos para disfrutar de lo que nos trajo aquí desde el principio.",
    "Volunteer, fundraise, cook, or just show up and eat. There's a place for you at FFAC.":
      "Sé voluntario, recauda fondos, cocina o simplemente ven a comer. Hay un lugar para ti en FFAC.",
    "Our Mission": "Nuestra misión", "What It Is": "Qué es", "Who we are:": "Quiénes somos:",
    "a social-service org and 501(c)(3) nonprofit that brings food lovers together and fights food insecurity in the Brazos Valley.":
      "una organización de servicio social y sin fines de lucro 501(c)(3) que reúne a los amantes de la comida y combate la inseguridad alimentaria en el Valle de Brazos.",
    "Join In": "Únete", "Get Involved": "Participa", "Lend a Hand": "Echa una mano",
    "Mark Your Calendar": "Marca tu calendario", "Happening Now": "Sucediendo ahora",
    "Coming Up": "Próximamente", "Up Next": "A continuación", "Next Event": "Próximo evento",
    "Impact": "Impacto", "Where we've been": "Dónde hemos estado", "Learning": "Aprendizaje",
    "Volunteering": "Voluntariado", "Planning Service & Fundraisers": "Planificación de servicio y recaudaciones",
    "Members help plan upcoming volunteer events and fundraisers for local food banks.":
      "Los miembros ayudan a planificar los próximos eventos de voluntariado y recaudaciones para los bancos de alimentos locales.",
    "Members practice kitchen skills and try new recipes together.":
      "Los miembros practican habilidades de cocina y prueban recetas nuevas juntos.",
    "Members volunteer at the Brazos Valley Food Bank.":
      "Los miembros son voluntarios en el Banco de Alimentos del Valle de Brazos.",
    "Members volunteer with food banks and similar organizations across Bryan-College Station. Upcoming events are listed below.":
      "Los miembros son voluntarios en bancos de alimentos y organizaciones similares en Bryan-College Station. Los próximos eventos aparecen abajo.",
    "Members work directly with food banks and hunger-relief organizations across Bryan-College Station.":
      "Los miembros trabajan directamente con bancos de alimentos y organizaciones contra el hambre en Bryan-College Station.",
    "Meetings, fundraisers, service, and socials in one place.": "Reuniones, recaudaciones, servicio y eventos sociales en un solo lugar.",
    "Raising money for hunger-relief organizations in our community.": "Recaudamos fondos para organizaciones contra el hambre en nuestra comunidad.",
    "Collecting food and donations for neighbors in need.": "Recolectamos alimentos y donaciones para vecinos que lo necesitan.",
    "Volunteering with food banks and hunger-relief organizations.": "Voluntariado con bancos de alimentos y organizaciones contra el hambre.",
    "Potlucks, cookouts, and food-spot outings.": "Comidas compartidas, parrilladas y salidas a lugares de comida.",
    "Potlucks, cookouts, and trips to local restaurants around Bryan-College Station.":
      "Comidas compartidas, parrilladas y visitas a restaurantes locales de Bryan-College Station.",
    "Potlucks and cookouts give members a place to share food.": "Las comidas compartidas y parrilladas dan a los miembros un lugar para compartir comida.",
    "Potlucks & Cookouts": "Comidas compartidas y parrilladas",
    "Local Food Spots": "Lugares de comida locales",
    "We check out fun, local food joints around Bryan-College Station as a group.":
      "Visitamos en grupo lugares de comida locales y divertidos en Bryan-College Station.",
    "Cooking & Baking Classes": "Clases de cocina y repostería",
    "Sessions on kitchen skills and new recipes.": "Sesiones sobre habilidades de cocina y recetas nuevas.",
    "Our own program: bulk-cooked meals and free health screenings for Brazos County's homeless-heavy areas. Our first event on September 12 fed 53 people.":
      "Nuestro propio programa: comidas cocinadas en grandes cantidades y exámenes de salud gratuitos para las zonas con más personas sin hogar del condado de Brazos. Nuestro primer evento, el 12 de septiembre, alimentó a 53 personas.",
    "potlucks, cookouts, and restaurant outings, plus volunteering with the Brazos Valley Food Bank, other food banks and kitchens, and the Aggieland Humane Society.":
      "comidas compartidas, parrilladas y salidas a restaurantes, además de voluntariado con el Banco de Alimentos del Valle de Brazos, otros bancos de alimentos y cocinas, y la Sociedad Humanitaria de Aggieland.",
    "a bake sale on 11/19 from 10 PM–1 AM and volunteering at the Brazos Valley Food Bank on 11/21, 8–10 AM.":
      "una venta de pasteles el 19/11 de 10 PM a 1 AM y voluntariado en el Banco de Alimentos del Valle de Brazos el 21/11, de 8 a 10 AM.",

    // ---- meetings ----
    "How We Meet": "Cómo nos reunimos", "What to Expect": "Qué esperar", "Themed Meetings": "Reuniones temáticas",
    "Upcoming Meetings": "Próximas reuniones", "Past Meetings": "Reuniones pasadas",
    "Biweekly meetings on food, service, and community, covering the topics below.":
      "Reuniones quincenales sobre comida, servicio y comunidad, que cubren los temas de abajo.",
    "Each meeting covers a different topic, part discussion and part hands-on, with food every time.":
      "Cada reunión trata un tema distinto, mitad discusión y mitad práctica, con comida siempre.",
    "Every meeting covers a different topic: other cultures, food history, the science of cooking, and food marketing.":
      "Cada reunión trata un tema distinto: otras culturas, historia de la comida, la ciencia de cocinar y mercadotecnia de alimentos.",
    "We meet every other Wednesday, with free food at every meeting.": "Nos reunimos un miércoles sí y otro no, con comida gratis en cada reunión.",
    "Culture": "Cultura", "History": "Historia", "Science": "Ciencia", "Marketing": "Mercadotecnia", "Hands-On": "Práctica",
    "Foods from Other Cultures": "Comidas de otras culturas", "Food & History": "Comida e historia",
    "The Science of Food": "La ciencia de la comida", "Food Marketing": "Mercadotecnia de alimentos",
    "Exploring dishes, traditions, and cooking styles from around the world.": "Exploramos platillos, tradiciones y estilos de cocina de todo el mundo.",
    "How food has shaped, and been shaped by, major moments in history.": "Cómo la comida ha moldeado los grandes momentos de la historia, y cómo ellos la han moldeado a ella.",
    "The chemistry and biology behind cooking, flavor, and nutrition.": "La química y la biología detrás de la cocina, el sabor y la nutrición.",
    "How branding, advertising, and packaging shape what and how we eat.": "Cómo la marca, la publicidad y el empaque influyen en lo que comemos y cómo lo comemos.",
    "First General Meeting": "Primera reunión general", "Second General Meeting": "Segunda reunión general",
    "Third General Meeting": "Tercera reunión general", "Fourth General Meeting": "Cuarta reunión general",
    "Fifth General Meeting": "Quinta reunión general", "Sixth General Meeting": "Sexta reunión general",
    "Our kickoff meeting for the semester. Flip through the slides below.": "Nuestra reunión de inicio del semestre. Mira las diapositivas de abajo.",
    "Feed The Valley recap, bake sale and volunteering sign-ups, and our new tree planting program. Flip through the slides below.":
      "Resumen de Feed The Valley, inscripciones para la venta de pasteles y el voluntariado, y nuestro nuevo programa de siembra de árboles. Mira las diapositivas de abajo.",
    "Feed The Valley roles and sign-ups, the Food-Givings drive, upcoming volunteering, and a round of charades. Flip through the slides below.":
      "Funciones e inscripciones de Feed The Valley, la colecta Food-Givings, próximos voluntariados y una ronda de charadas. Mira las diapositivas de abajo.",
    "Cookout and Bridge Ministry service recaps, bake sale updates, and a round of Family Feud. Flip through the slides below.":
      "Resúmenes de la parrillada y del servicio en Bridge Ministry, novedades de la venta de pasteles y una ronda de Family Feud. Mira las diapositivas de abajo.",
    "all ten officers introduced themselves.": "los diez miembros de la directiva se presentaron.",
    "officers pitched our bake sales, volunteer shifts, and socials.": "la directiva presentó nuestras ventas de pasteles, turnos de voluntariado y eventos sociales.",
    "we wrapped up with a game.": "terminamos con un juego.",
    "food edition to close out the meeting.": "edición de comida para cerrar la reunión.",
    "our Cloud9 bake sale was a big success; next up is Bottlecap Alley on Thursday 11/19.":
      "nuestra venta de pasteles con Cloud9 fue un gran éxito; lo siguiente es Bottlecap Alley el jueves 19/11.",
    "our first event on 9/12 fed 53 people healthy meals; the next one is still being planned.":
      "nuestro primer evento, el 12/9, alimentó a 53 personas con comidas saludables; el siguiente aún se está planeando.",
    "our first service event, Saturday 9/26, 9:30–10:30 AM at the Aggieland Humane Society.":
      "nuestro primer evento de servicio, el sábado 26/9, de 9:30 a 10:30 AM en la Sociedad Humanitaria de Aggieland.",
    "non-perishable food for the Lee Chapel Church Food Pantry, 11/2–11/20, with drop-offs at the MSC, Zachry, the Commons, and Main Rec.":
      "alimentos no perecederos para la despensa de la Iglesia Lee Chapel, del 2/11 al 20/11, con puntos de entrega en el MSC, Zachry, el Commons y Main Rec.",
    "a new partnership with TAMU professors and the City of College Station offering students an extra-credit chance to donate $1 and plant a tree on public land.":
      "una nueva alianza con profesores de TAMU y la Ciudad de College Station que ofrece a los estudiantes crédito extra por donar $1 y plantar un árbol en terrenos públicos.",
    "our new program that cooks healthy meals from bulk ingredients and hands them out, with free health screenings, in homeless-heavy areas of the Brazos Valley.":
      "nuestro nuevo programa que cocina comidas saludables con ingredientes al por mayor y las reparte, con exámenes de salud gratuitos, en zonas del Valle de Brazos con muchas personas sin hogar.",
    "Bake sale:": "Venta de pasteles:", "Bake sales:": "Ventas de pasteles:", "Charades:": "Charadas:",
    "Cookout:": "Parrillada:", "Family Feud:": "Family Feud:", "Feed The Valley:": "Feed The Valley:",
    "Food-Givings:": "Food-Givings:", "Jeopardy:": "Jeopardy:", "Social and service:": "Social y servicio:",
    "Tree planting program:": "Programa de siembra de árboles:", "Volunteering:": "Voluntariado:",
    "Upcoming events:": "Próximos eventos:", "Upcoming:": "Próximamente:", "Meet the officers:": "Conoce a la directiva:",
    "Membership:": "Membresía:", "Cooking:": "Cocina:", "Food handout:": "Reparto de comida:",
    "What we covered": "Lo que vimos", "Note:": "Nota:", "Event:": "Evento:", "When:": "Cuándo:", "Where:": "Dónde:", "Food:": "Comida:",
    "Fed:": "Personas alimentadas:",
    "First general meeting slides": "Diapositivas de la primera reunión general",
    "Second general meeting slides": "Diapositivas de la segunda reunión general",
    "Third general meeting slides": "Diapositivas de la tercera reunión general",
    "Fourth general meeting slides": "Diapositivas de la cuarta reunión general",
    "Previous slide": "Diapositiva anterior", "Next slide": "Diapositiva siguiente",
    "Previous photo": "Foto anterior", "Next photo": "Foto siguiente",
    "Previous month": "Mes anterior", "Next month": "Mes siguiente",

    // ---- fundraisers / service / social / food drives ----
    "Upcoming Fundraisers": "Próximas recaudaciones", "Past Fundraisers": "Recaudaciones pasadas",
    "Upcoming Service Events": "Próximos eventos de servicio", "Past Service Events": "Eventos de servicio pasados",
    "Upcoming Social Events": "Próximos eventos sociales", "Past Social Events": "Eventos sociales pasados",
    "All Service Events": "Todos los eventos de servicio",
    "Upcoming events": "Próximos eventos", "Past Events": "Eventos pasados",
    "Bake Sale": "Venta de pasteles", "Bake Sale at Bottlecap Alley": "Venta de pasteles en Bottlecap Alley",
    "Bake Sale with Cloud9 Run Club": "Venta de pasteles con el club de corredores Cloud9",
    "Bake sales and other fundraisers pay for Feed The Valley meals.": "Las ventas de pasteles y otras recaudaciones pagan las comidas de Feed The Valley.",
    "Our bake sales benefit Feed the Valley.": "Nuestras ventas de pasteles benefician a Feed the Valley.",
    "A bake sale partnered with the Cloud9 run club, with all proceeds going to Feed The Valley.":
      "Una venta de pasteles con el club de corredores Cloud9; todas las ganancias van a Feed The Valley.",
    "Cookies and brownies, $3 each. $1 = 1 meal for a hungry neighbor, with proceeds going to Feed The Valley.":
      "Galletas y brownies, $3 cada uno. $1 = 1 comida para un vecino con hambre; las ganancias van a Feed The Valley.",
    "Cookies and brownies, $3 each. $1 = 1 meal for a hungry neighbor.": "Galletas y brownies, $3 cada uno. $1 = 1 comida para un vecino con hambre.",
    "Our Halloween bake sale: cookies and brownies, $3 each. $1 = 1 meal for a hungry neighbor.":
      "Nuestra venta de pasteles de Halloween: galletas y brownies, $3 cada uno. $1 = 1 comida para un vecino con hambre.",
    "Cookies and brownies, fresh off the table": "Galletas y brownies, recién salidos de la mesa",
    "Bake sales in action": "Ventas de pasteles en acción", "Fundraiser photos": "Fotos de las recaudaciones",
    "Saturday 9/26, selling cookies and brownies to fund Feed The Valley and other events.":
      "Sábado 26/9, vendiendo galletas y brownies para financiar Feed The Valley y otros eventos.",
    "Thursday, November 19, 10 PM to 1 AM, Northgate, behind Bottlecap Alley. Sign up to help. Proceeds benefit Feed The Valley.":
      "Jueves 19 de noviembre, de 10 PM a 1 AM, Northgate, detrás de Bottlecap Alley. Inscríbete para ayudar. Las ganancias benefician a Feed The Valley.",
    "Brazos Valley Food Bank": "Banco de Alimentos del Valle de Brazos", "Bridge Ministry": "Bridge Ministry",
    "Aggieland Humane Society": "Sociedad Humanitaria de Aggieland",
    "Members volunteered at the Bridge Ministry food pantry, sorting food and bagging groceries for families in need.":
      "Los miembros fueron voluntarios en la despensa de Bridge Ministry, clasificando alimentos y embolsando víveres para familias necesitadas.",
    "Members volunteered in the food bank's repack room, sorting donations and packing boxes for families across the Brazos Valley.":
      "Los miembros fueron voluntarios en la sala de reempaque del banco de alimentos, clasificando donaciones y empacando cajas para familias de todo el Valle de Brazos.",
    "Our first service event of the semester: members spent an hour with the shelter's cats and dogs.":
      "Nuestro primer evento de servicio del semestre: los miembros pasaron una hora con los gatos y perros del refugio.",
    "Saturday, November 21, 8 to 10 AM, Brazos Valley Food Bank. Volunteer with us at the food bank. Sign up below.":
      "Sábado 21 de noviembre, de 8 a 10 AM, Banco de Alimentos del Valle de Brazos. Sé voluntario con nosotros en el banco de alimentos. Inscríbete abajo.",
    "Sign Up to Volunteer": "Inscríbete como voluntario", "Sign Up to Help": "Inscríbete para ayudar", "Sign Up": "Inscribirse",
    "Sign up": "Inscribirse",
    "Service event photos": "Fotos de eventos de servicio",
    "Aggieland Humane Society volunteering photos": "Fotos del voluntariado en la Sociedad Humanitaria de Aggieland",
    "Bridge Ministry volunteering photos": "Fotos del voluntariado en Bridge Ministry",
    "Bridge Ministry food sorting, Friday 10/23, 11:30 AM–12:30 PM.": "Clasificación de alimentos en Bridge Ministry, viernes 23/10, 11:30 AM–12:30 PM.",
    "Group photo at the Brazos Valley Food Bank": "Foto grupal en el Banco de Alimentos del Valle de Brazos",
    "Repacking boxes on the line": "Reempacando cajas en la línea", "Stacking crates in the food repack room": "Apilando cajas en la sala de reempaque",
    "Friday, 10/23: Bagging groceries at the sorting table": "Viernes 23/10: Embolsando víveres en la mesa de clasificación",
    "Friday, 10/23: Packing snacks into boxes for pantry families": "Viernes 23/10: Empacando bocadillos en cajas para familias de la despensa",
    "Friday, 10/23: Three volunteers with carts full of bagged groceries": "Viernes 23/10: Tres voluntarios con carritos llenos de víveres embolsados",
    "Saturday, 9/26: cuddling a kitten at the Aggieland Humane Society": "Sábado 26/9: abrazando a un gatito en la Sociedad Humanitaria de Aggieland",
    "Saturday, 9/26: our Northgate bake sale, piñata included": "Sábado 26/9: nuestra venta de pasteles en Northgate, con piñata incluida",
    "Sunday, 10/18: A piñata makes an appearance": "Domingo 18/10: aparece una piñata",
    "Sunday, 10/18: Handing off a Rice Crispy treat": "Domingo 18/10: entregando un dulce de Rice Crispy",
    "Sunday, 10/18: Packing treats at the table": "Domingo 18/10: empacando dulces en la mesa",
    "Sunday, 10/18: Paying by card after dark": "Domingo 18/10: pagando con tarjeta de noche",
    "Sunday, 10/18: The Cloud9 run club takes off": "Domingo 18/10: el club de corredores Cloud9 arranca",
    "Sunday, 10/18: The Corner Bar on Northgate": "Domingo 18/10: The Corner Bar en Northgate",
    "Sunday, 10/18: Writing up the sign": "Domingo 18/10: escribiendo el letrero",
    "A curious kitten greets us at the cage door": "Un gatito curioso nos saluda en la puerta de la jaula",
    "A member hugs a gray-and-white kitten": "Un miembro abraza a un gatito gris y blanco",
    "A member meets one of the shelter kittens": "Un miembro conoce a uno de los gatitos del refugio",
    "Playing with a kitten using a toy ball": "Jugando con un gatito con una pelota de juguete",
    "The FFAC volunteer crew outside the shelter": "El equipo de voluntarios de FFAC afuera del refugio",
    "Customers who stopped by the bake sale": "Clientes que pasaron por la venta de pasteles",
    "Handing out brownies and cookies": "Repartiendo brownies y galletas",
    "Our Northgate bake sale with the piñata": "Nuestra venta de pasteles en Northgate con la piñata",
    "The bake sale sign: $3 for cookies and brownies, $1 = 1 meal for a hungry neighbor":
      "El letrero de la venta: $3 por galletas y brownies, $1 = 1 comida para un vecino con hambre",
    "The crew at our banner on Northgate": "El equipo junto a nuestra pancarta en Northgate",
    "FFAC Cookout": "Parrillada de FFAC", "First Friday": "First Friday",
    "Free hotdogs, burgers, and soda, plus music and volleyball. Co-hosted with TAMU HOSA, our first collaboration event.":
      "Hot dogs, hamburguesas y refrescos gratis, además de música y voleibol. Organizado junto con TAMU HOSA, nuestro primer evento en colaboración.",
    "Sunday 10/25, free burgers, hotdogs, and soda plus volleyball at the Junction, co-hosted with TAMU HOSA.":
      "Domingo 25/10, hamburguesas, hot dogs y refrescos gratis más voleibol en el Junction, organizado junto con TAMU HOSA.",
    "Join us for a social night at Downtown Bryan’s First Friday.": "Acompáñanos en una noche social en el First Friday del centro de Bryan.",
    "Friday, December 4, 6 to 9 PM, Downtown Bryan. Join us for a social night at Downtown Bryan's First Friday. Sign up below.":
      "Viernes 4 de diciembre, de 6 a 9 PM, centro de Bryan. Acompáñanos en una noche social en el First Friday del centro de Bryan. Inscríbete abajo.",
    "Downtown Bryan": "Centro de Bryan", "Northgate, behind Bottlecap Alley": "Northgate, detrás de Bottlecap Alley",
    "The Corner Bar, Northgate": "The Corner Bar, Northgate",
    "Food Drive": "Colecta de alimentos",
    "A Thanksgiving food drive benefiting the Lee Chapel Church Food Pantry.": "Una colecta de alimentos de Acción de Gracias a beneficio de la despensa de la Iglesia Lee Chapel.",
    "Food-Givings helps the Lee Chapel Church Food Pantry give our neighbors the Thanksgiving meal they deserve.":
      "Food-Givings ayuda a la despensa de la Iglesia Lee Chapel a darles a nuestros vecinos la cena de Acción de Gracias que merecen.",
    "Lee Chapel Church Food Pantry": "Despensa de la Iglesia Lee Chapel", "Benefiting": "A beneficio de",
    "Non-perishable food and monetary donations": "Alimentos no perecederos y donaciones en efectivo",
    "Where to Give": "Dónde donar", "Drop-Off": "Entrega", "Drop-off locations": "Puntos de entrega",
    "Four campus locations": "Cuatro lugares en el campus", "Outside all 4 locations": "Afuera de los 4 lugares",
    "Containers": "Contenedores",
    "MSC (Integrity), Zachry, Commons, and Main Rec": "MSC (Integrity), Zachry, Commons y Main Rec",
    "Food-Givings drop-off locations: MSC (Integrity), Zachry, Commons, and Main Rec": "Puntos de entrega de Food-Givings: MSC (Integrity), Zachry, Commons y Main Rec",
    "Each container has sharpies for marking your donation. Put the lid back on after you drop it off.":
      "Cada contenedor tiene marcadores para identificar tu donación. Vuelve a poner la tapa después de dejarla.",
    "To count your donation, write your name and your org’s name on it with the sharpies at the bin. We can’t credit unmarked donations.":
      "Para que cuente tu donación, escribe tu nombre y el de tu organización con los marcadores del contenedor. No podemos acreditar donaciones sin identificar.",
    "Prizes": "Premios", "Awards": "Premios", "Top Donor Awards": "Premios a los mayores donantes", "Donor prizes": "Premios para donantes",
    "Org prize": "Premio para organizaciones",
    "$100 grant from FFAC for the student org with the most donations": "Subvención de $100 de FFAC para la organización estudiantil con más donaciones",
    "For the individual donors with the most donations": "Para los donantes individuales con más donaciones",
    "Top Donor Awards flyer: the student org with the most donations wins a $100 grant from FFAC":
      "Volante de los premios a los mayores donantes: la organización estudiantil con más donaciones gana una subvención de $100 de FFAC",
    "Food-Givings flyer: a food drive benefiting the Lee Chapel Church Food Pantry, until November 20th":
      "Volante de Food-Givings: una colecta a beneficio de la despensa de la Iglesia Lee Chapel, hasta el 20 de noviembre",
    "Food drive for the Thanksgiving meal": "Colecta para la cena de Acción de Gracias",
    "Accepting": "Aceptando", "Announced": "Anunciado", "Through": "Hasta", "To be announced": "Por anunciar",
    "Location to be announced": "Lugar por anunciar", "November 13": "13 de noviembre", "November 20": "20 de noviembre",

    // ---- calendar ----
    "Search": "Buscar", "Refresh": "Actualizar", "Date": "Fecha", "Where": "Dónde", "What": "Qué",
    "No upcoming events right now. Check back soon.": "No hay eventos próximos por ahora. Vuelve pronto.",
    "Meeting": "Reunión", "Fundraiser": "Recaudación", "Service": "Servicio", "Social": "Social",
    "Food Drive": "Colecta de alimentos", "Food-Givings Ends": "Termina Food-Givings",
    "Food-Givings Prizes Announced": "Anuncio de premios de Food-Givings",
    "Sun": "Dom", "Mon": "Lun", "Tue": "Mar", "Wed": "Mié", "Thu": "Jue", "Fri": "Vie", "Sat": "Sáb",
    "JAN": "ENE", "FEB": "FEB", "MAR": "MAR", "APR": "ABR", "MAY": "MAY", "JUN": "JUN",
    "JUL": "JUL", "AUG": "AGO", "SEP": "SEP", "OCT": "OCT", "NOV": "NOV", "DEC": "DIC",
    "Drop-off at MSC, Zachry, Commons, Main Rec": "Entrega en MSC, Zachry, Commons, Main Rec",
    "Cooking 9–11:30 AM, handout 1–3 PM": "Cocina 9–11:30 AM, reparto 1–3 PM",
    "Brazos County": "Condado de Brazos",

    // ---- Feed The Valley ----
    "Meals and health screenings for Brazos County, run by FFAC.": "Comidas y exámenes de salud para el condado de Brazos, a cargo de FFAC.",
    "Feed The Valley provides healthy meals to people in need across Brazos County, alongside free health screenings and referrals to local care. FFAC buys food in bulk from Restaurant Depot, prepares the meals, and sets up tables in the county's homeless-heavy areas.":
      "Feed The Valley ofrece comidas saludables a personas necesitadas en todo el condado de Brazos, junto con exámenes de salud gratuitos y referencias a atención local. FFAC compra alimentos al por mayor en Restaurant Depot, prepara las comidas e instala mesas en las zonas del condado con más personas sin hogar.",
    "Free Meals and Health Screenings": "Comidas y exámenes de salud gratuitos",
    "Feed The Valley: free meals and health screenings": "Feed The Valley: comidas y exámenes de salud gratuitos",
    "A community relief program": "Un programa de ayuda comunitaria",
    "Meals": "Comidas", "Bulk-cooked, healthy food": "Comida saludable cocinada en grandes cantidades",
    "We buy food in bulk and cook full meals.": "Compramos alimentos al por mayor y cocinamos comidas completas.",
    "Health": "Salud", "Free screenings": "Exámenes gratuitos",
    "Blood pressure, pulse oximetry, hunger vital signs, and BMI at one table.": "Presión arterial, oximetría de pulso, signos vitales de hambre e IMC en una sola mesa.",
    "Referrals": "Referencias", "Connections to care": "Conexión con atención médica",
    "We refer anyone who needs follow-up care to a local clinic that fits their budget.": "Referimos a quien necesite atención de seguimiento a una clínica local que se ajuste a su presupuesto.",
    "Volunteer or point someone our way": "Sé voluntario o envíanos a alguien",
    "Volunteer with Foodies For A Cause to hand out free meals and provide health screenings to those in need.":
      "Sé voluntario con Foodies For A Cause para repartir comidas gratis y ofrecer exámenes de salud a quienes lo necesitan.",
    "To help run a table, or to send someone who needs a meal or a free screening our way, contact us.":
      "Para ayudar a atender una mesa, o para enviarnos a alguien que necesite una comida o un examen gratuito, contáctanos.",
    "Contact Us": "Contáctanos",
    "Neighbors we've fed": "Vecinos que hemos alimentado", "People Fed So Far": "Personas alimentadas hasta ahora",
    "Where we've been": "Dónde hemos estado",
    "Our first Feed The Valley event, held on 9/12 at Grace Bible Church.": "Nuestro primer evento de Feed The Valley, realizado el 12/9 en la Iglesia Grace Bible.",
    "Our second Feed The Valley event, held on 11/7.": "Nuestro segundo evento de Feed The Valley, realizado el 7/11.",
    "Feed The Valley: first tabling event": "Feed The Valley: primer evento con mesa",
    "Feed The Valley photos": "Fotos de Feed The Valley",
    "Grace Bible Church •": "Iglesia Grace Bible •", "903 N Washington Ave, Bryan •": "903 N Washington Ave, Bryan •",
    "117 people": "117 personas", "53 people": "53 personas",
    "Loading meals into the warming cabinet": "Cargando comidas en el gabinete calentador",
    "Meals packed and ready to hand out": "Comidas empacadas y listas para repartir",
    "Our volunteers after the event": "Nuestros voluntarios después del evento",
    "Reserve a Meal": "Reserva una comida", "RSVP for a free meal": "Confirma tu asistencia para una comida gratis",
    "Reserve a free meal at our next Feed The Valley event.": "Reserva una comida gratis en nuestro próximo evento de Feed The Valley.",
    "Reserve my meal": "Reservar mi comida", "Meals Still Available": "Comidas aún disponibles",
    "We will post the location and food here once they are set.": "Publicaremos aquí el lugar y la comida cuando estén definidos.",
    "How many people are you reserving for?": "¿Para cuántas personas reservas?",
    "Dietary needs or allergies (optional)": "Necesidades dietéticas o alergias (opcional)",
    "Phone or email (optional, so we can reach you about the event)": "Teléfono o correo (opcional, para poder contactarte sobre el evento)",
    "Photo release: we may take photos at the event, and I'm okay with them being posted by Foodies For A Cause.":
      "Autorización de fotos: podemos tomar fotos en el evento y estoy de acuerdo con que Foodies For A Cause las publique.",
    "Please check the photo release box to RSVP.": "Marca la casilla de autorización de fotos para confirmar.",
    "Please enter a party size from 1 to 20.": "Ingresa un número de personas del 1 al 20.",
    "Please enter your name.": "Ingresa tu nombre.",
    "Something went wrong. Please try again.": "Algo salió mal. Inténtalo de nuevo.",
    "Network error. Please try again.": "Error de red. Inténtalo de nuevo.",
    "Volunteer with us on Saturday, December 5th": "Sé voluntario con nosotros el sábado 5 de diciembre",
    "Saturday, December 5, 2026. Pick a role: cooking, food handout, or associate screening.":
      "Sábado 5 de diciembre de 2026. Elige una función: cocina, reparto de comida o evaluación asociada.",
    "Cooking is 9–11:30 AM in home kitchens. Food handout and health screenings are 1–3 PM at 903 N Washington Ave, Bryan. We need cooks, and associate screeners too.":
      "La cocina es de 9 a 11:30 AM en cocinas de casas. El reparto de comida y los exámenes de salud son de 1 a 3 PM en 903 N Washington Ave, Bryan. Necesitamos cocineros y también evaluadores asociados.",
    "Cook meals in a home kitchen. 2 days before the event you will get an email assigning your cooking location.":
      "Cocina comidas en la cocina de una casa. 2 días antes del evento recibirás un correo con tu lugar de cocina asignado.",
    "Hand out free meals and help with setup and takedown at 903 N Washington Ave, Bryan.":
      "Reparte comidas gratis y ayuda a montar y desmontar en 903 N Washington Ave, Bryan.",
    "Take basic vitals at our free health screening table. No experience? We will email you 1 week before the event to schedule a 1-hour in-person vitals training.":
      "Toma signos vitales básicos en nuestra mesa de exámenes de salud gratuitos. ¿Sin experiencia? Te enviaremos un correo 1 semana antes del evento para programar una capacitación presencial de 1 hora sobre signos vitales.",
    "Sign up to cook": "Inscribirme para cocinar", "Sign up for handout": "Inscribirme para el reparto", "Sign up to screen": "Inscribirme para evaluar",
    "Cooks Needed": "Se necesitan cocineros", "Handout Volunteers Needed": "Se necesitan voluntarios para el reparto",
    "Associate Screeners Needed": "Se necesitan evaluadores asociados",
    "Cooks are integral to this event. We cook the meals in home kitchens the morning of the event, so there is no event without them. Please pick cooking if you can.":
      "Los cocineros son esenciales para este evento. Cocinamos las comidas en cocinas de casas la mañana del evento, así que sin ellos no hay evento. Elige cocinar si puedes.",
    "We need cooks.": "Necesitamos cocineros.",
    "Cooks make the meals we hand out, so there is no event without them. Cooking runs": "Los cocineros preparan las comidas que repartimos, así que sin ellos no hay evento. La cocina es",
    "Handout volunteers give out free meals and help with setup and takedown. Food handout runs": "Los voluntarios del reparto entregan comidas gratis y ayudan a montar y desmontar. El reparto de comida es",
    "Associate Screeners take basic vitals (blood pressure, temperature, pulse ox, and similar) at our free health screening table. Screening runs":
      "Los evaluadores asociados toman signos vitales básicos (presión arterial, temperatura, oximetría de pulso y similares) en nuestra mesa de exámenes de salud gratuitos. La evaluación es",
    "Associate Screener": "Evaluador asociado", "Feed The Valley: Associate Screener": "Feed The Valley: Evaluador asociado",
    "Feed The Valley: Cooking": "Feed The Valley: Cocina", "Feed The Valley: Food Handout": "Feed The Valley: Reparto de comida",
    "Food Handout": "Reparto de comida", "Handout": "Reparto", "Cooking": "Cocina", "Cooks": "Cocineros", "Cook": "Cocinar",
    "with food handout. Cooking is a separate sign-up (9–11:30 AM).": "con el reparto de comida. La cocina es una inscripción aparte (9–11:30 AM).",
    "Associate Screener and food handout happen at the same time, so you cannot do both.": "El evaluador asociado y el reparto de comida ocurren al mismo tiempo, así que no puedes hacer ambos.",
    "food handout and Associate Screener happen at the same time, so you cannot do both.": "el reparto de comida y el evaluador asociado ocurren al mismo tiempo, así que no puedes hacer ambos.",
    "Associate Screeners take basic vitals": "Los evaluadores asociados toman signos vitales",
    ", a different time slot than food handout (1–3 PM).": ", un horario distinto al del reparto de comida (1–3 PM).",
    ". Cooking is a separate sign-up with a different time slot (9–11:30 AM).": ". La cocina es una inscripción aparte con un horario distinto (9–11:30 AM).",
    "Food Handout and Associate Screener happen at the same time (1–3 PM), so you cannot do both. Cooking is earlier in the day and can be combined with either.":
      "El reparto de comida y el evaluador asociado ocurren al mismo tiempo (1–3 PM), así que no puedes hacer ambos. La cocina es más temprano en el día y se puede combinar con cualquiera de los dos.",
    "No experience or certification?": "¿Sin experiencia ni certificación?",
    "We will email you": "Te enviaremos un correo",
    "1 week before the event": "1 semana antes del evento", "2 days before the event": "2 días antes del evento",
    "to schedule an in-person training course on taking vitals. The training takes": "para programar un curso presencial sobre cómo tomar signos vitales. La capacitación dura",
    "1 hour": "1 hora",
    "you will get an email assigning your cooking location.": "recibirás un correo con tu lugar de cocina asignado.",
    "← See all Feed The Valley roles": "← Ver todas las funciones de Feed The Valley",
    "1–3 PM": "1–3 PM", "9:00–11:30 AM": "9:00–11:30 AM", "9–11:30 AM on Saturday, December 5, 2026.": "9–11:30 AM el sábado 5 de diciembre de 2026.",
    "1–3 PM at 903 N Washington Ave, Bryan.": "1–3 PM en 903 N Washington Ave, Bryan.",
    "1–3 PM, 903 N Washington Ave, Bryan, TX 77803": "1–3 PM, 903 N Washington Ave, Bryan, TX 77803",
    "9–11:30 AM, in home kitchens": "9–11:30 AM, en cocinas de casas",
    "Saturday, December 5, 2026": "Sábado 5 de diciembre de 2026", "Saturday, December 5, 2026.": "Sábado 5 de diciembre de 2026.",
    "Saturday, December 5, 2026, 1–3 PM, 903 N Washington Ave, Bryan, TX 77803.": "Sábado 5 de diciembre de 2026, 1–3 PM, 903 N Washington Ave, Bryan, TX 77803.",
    "Saturday, December 5, 2026, cooking 9–11:30 AM in home kitchens. Meals are handed out 1–3 PM.":
      "Sábado 5 de diciembre de 2026, cocina de 9 a 11:30 AM en cocinas de casas. Las comidas se reparten de 1 a 3 PM.",
    "Saturday 11/7, 1–3 PM. Roles for cooks, servers, and associate screeners, with sign-ups at foodiesforacause.org.":
      "Sábado 7/11, 1–3 PM. Funciones para cocineros, personal de servicio y evaluadores asociados, con inscripciones en foodiesforacause.org.",
    "Thank you! You are signed up as an Associate Screener for Saturday, December 5, 1 to 3 PM.":
      "¡Gracias! Estás inscrito como evaluador asociado para el sábado 5 de diciembre, de 1 a 3 PM.",
    "Thank you! You are signed up for food handout on Saturday, December 5, 1 to 3 PM.":
      "¡Gracias! Estás inscrito para el reparto de comida el sábado 5 de diciembre, de 1 a 3 PM.",
    "Thank you! You are signed up to cook on Saturday, December 5, 9 to 11:30 AM. Watch for an email 2 days before the event assigning your cooking location.":
      "¡Gracias! Estás inscrito para cocinar el sábado 5 de diciembre, de 9 a 11:30 AM. Espera un correo 2 días antes del evento con tu lugar de cocina asignado.",
    "Since you have no vitals training yet, watch for an email 1 week before the event to schedule your 1-hour in-person training.":
      "Como aún no tienes capacitación en signos vitales, espera un correo 1 semana antes del evento para programar tu capacitación presencial de 1 hora.",

    // ---- forms ----
    "Name": "Nombre", "Full name": "Nombre completo", "Email": "Correo electrónico", "Phone number": "Número de teléfono",
    "Message": "Mensaje", "Send message": "Enviar mensaje", "Class year": "Año académico", "UIN": "UIN",
    "Select one": "Selecciona una opción", "Freshman": "Primer año", "Sophomore": "Segundo año", "Junior": "Tercer año",
    "Senior": "Último año", "Graduate": "Posgrado", "Other": "Otro", "Yes": "Sí", "No": "No",
    "Will you be attending?": "¿Asistirás?", "Will you be volunteering?": "¿Serás voluntario?",
    "Will you be volunteering for cooking?": "¿Serás voluntario para cocinar?",
    "Will you be volunteering for food handout?": "¿Serás voluntario para el reparto de comida?",
    "Will you be volunteering as an Associate Screener?": "¿Serás voluntario como evaluador asociado?",
    "Do you need a ride?": "¿Necesitas transporte?", "Can you provide rides to others?": "¿Puedes dar transporte a otras personas?",
    "Can you help bake?": "¿Puedes ayudar a hornear?", "Can you bake?": "¿Puedes hornear?",
    "Do you have a certification or training in taking vitals (blood pressure, temperature, pulse ox, pulse, etc.)?":
      "¿Tienes certificación o capacitación para tomar signos vitales (presión arterial, temperatura, oximetría de pulso, pulso, etc.)?",
    "Do you have a certification or training in taking vitals?": "¿Tienes certificación o capacitación para tomar signos vitales?",
    "Which certification or training do you have?": "¿Qué certificación o capacitación tienes?",
    "Which certification or training?": "¿Qué certificación o capacitación?",
    "Please describe your training": "Describe tu capacitación",
    "Emergency Medical Responder (EMR)": "Primer respondiente de emergencias médicas (EMR)",
    "Emergency Medical Technician (EMT / EMT-B)": "Técnico en emergencias médicas (EMT / EMT-B)",
    "Advanced EMT (AEMT)": "EMT avanzado (AEMT)", "Paramedic": "Paramédico",
    "BLS for Healthcare Providers (AHA)": "BLS para proveedores de atención médica (AHA)",
    "Certified Clinical Medical Assistant (CCMA, NHA)": "Asistente médico clínico certificado (CCMA, NHA)",
    "Certified Medical Assistant (CMA, AAMA)": "Asistente médico certificado (CMA, AAMA)",
    "Registered Medical Assistant (RMA, AMT)": "Asistente médico registrado (RMA, AMT)",
    "Certified Nursing Assistant (CNA)": "Asistente de enfermería certificado (CNA)",
    "Patient Care Technician (PCT / CPCT/A)": "Técnico de atención al paciente (PCT / CPCT/A)",
    "Phlebotomy Technician (CPT)": "Técnico en flebotomía (CPT)",
    "Licensed Vocational or Practical Nurse (LVN / LPN)": "Enfermero vocacional o práctico con licencia (LVN / LPN)",
    "Registered Nurse (RN)": "Enfermero registrado (RN)",
    "Physician, PA, or NP (or student in those programs)": "Médico, PA o NP (o estudiante de esos programas)",
    "Nursing student (completed clinical skills lab)": "Estudiante de enfermería (completó el laboratorio de habilidades clínicas)",
    "Military medic or corpsman training": "Capacitación como médico o sanitario militar",
    "Wilderness First Responder (WFR)": "Primer respondiente en zonas remotas (WFR)",
    "First Aid / CPR / AED course that covered vitals": "Curso de primeros auxilios / RCP / DEA que incluyó signos vitales",
    "High school health science or HOSA clinical skills training": "Capacitación en ciencias de la salud de preparatoria o habilidades clínicas de HOSA",
    "Other allied health license (respiratory therapist, PTA, etc.)": "Otra licencia de salud afín (terapeuta respiratorio, PTA, etc.)",
    "All three must match what you entered when you signed up. Sign-ups for events that have already happened can't be changed.":
      "Los tres deben coincidir con lo que ingresaste al inscribirte. Las inscripciones de eventos que ya ocurrieron no se pueden cambiar.",
    "Plans changed? Enter the name, phone number and email you signed up with to edit or delete your sign-ups.":
      "¿Cambiaron tus planes? Ingresa el nombre, teléfono y correo con los que te inscribiste para editar o eliminar tus inscripciones.",
    "Edit or cancel my sign-up": "Editar o cancelar mi inscripción", "Manage My Sign-Up": "Administrar mi inscripción",
    "Find my sign-ups": "Buscar mis inscripciones", "Save changes": "Guardar cambios", "Delete sign-up": "Eliminar inscripción",
    "Delete this sign-up? This cannot be undone.": "¿Eliminar esta inscripción? Esto no se puede deshacer.",
    "Saved.": "Guardado.", "Filled": "Lleno", "This sign-up has been filled.": "Esta inscripción está llena.",
    "Could not delete. The event may have passed.": "No se pudo eliminar. Es posible que el evento ya haya pasado.",
    "Could not save. The event may have passed.": "No se pudo guardar. Es posible que el evento ya haya pasado.",
    "This event has passed, so this sign-up can no longer be changed.": "Este evento ya pasó, por lo que esta inscripción ya no se puede cambiar.",
    "No sign-ups found. Use the same name, phone number and email you signed up with.":
      "No se encontraron inscripciones. Usa el mismo nombre, teléfono y correo con los que te inscribiste.",
    "Your sign-up was deleted. No other sign-ups found.": "Tu inscripción fue eliminada. No se encontraron otras inscripciones.",
    "Service event": "Evento de servicio", "Social event": "Evento social", "Associate screener": "Evaluador asociado",
    "Food handout": "Reparto de comida", "Date not set": "Fecha sin definir", "no date": "sin fecha",
    "Please answer every question.": "Responde todas las preguntas.", "Please choose your certification or training.": "Elige tu certificación o capacitación.",
    "Please describe your training.": "Describe tu capacitación.", "Please enter a message.": "Ingresa un mensaje.",
    "Please enter a valid email.": "Ingresa un correo válido.", "Please enter a valid phone number.": "Ingresa un número de teléfono válido.",
    "Please enter your full name.": "Ingresa tu nombre completo.", "Please select your class year.": "Selecciona tu año académico.",
    "UIN must be 9 digits.": "El UIN debe tener 9 dígitos.",
    "Thank you! We'll get back to you soon.": "¡Gracias! Te responderemos pronto.",
    "Thank you! You're signed up.": "¡Gracias! Estás inscrito.",
    "Questions, ideas, or want to get involved? Reach out.": "¿Preguntas, ideas o quieres participar? Escríbenos.",
    "foodiesforacauseorg@gmail.com": "foodiesforacauseorg@gmail.com", "@foodiesforacauseorg": "@foodiesforacauseorg",
    "Sign up to join Foodies For A Cause. We'll add you to our member list.": "Inscríbete para unirte a Foodies For A Cause. Te agregaremos a nuestra lista de miembros.",
    "3 meetings, 1 fundraiser, 1 service event, and 2 Feed The Valley events per semester, plus $20 semester dues.":
      "3 reuniones, 1 recaudación, 1 evento de servicio y 2 eventos de Feed The Valley por semestre, más $20 de cuota semestral.",
    "Redirecting to": "Redirigiendo a", "our donation form": "nuestro formulario de donación",

    // ---- officers / portal ----
    "Meet the Officers": "Conoce a la directiva", "The people running FFAC this year.": "Las personas que dirigen FFAC este año.",
    "President": "Presidente", "Vice President": "Vicepresidente", "Secretary": "Secretario", "Treasurer": "Tesorero",
    "Service Chair": "Responsable de servicio", "Social Chair": "Responsable social", "Fundraising Chair": "Responsable de recaudación",
    "Feed The Valley Chair": "Responsable de Feed The Valley", "Research Co-Chair": "Co-responsable de investigación",
    "Officer Login": "Acceso de la directiva", "Officer login": "Acceso de la directiva", "Officer TAMU email": "Correo TAMU de la directiva",
    "Password": "Contraseña", "Sign in": "Iniciar sesión", "Sign out": "Cerrar sesión", "Signed in as": "Sesión iniciada como",
    "Sign-ups, RSVPs, members, and messages. Officers only.": "Inscripciones, confirmaciones, miembros y mensajes. Solo para la directiva.",
    "Use your officer TAMU email and the officer password. Ask Rylan if you do not have it.": "Usa tu correo TAMU de la directiva y la contraseña de la directiva. Pídesela a Rylan si no la tienes.",
    "Wrong email or password.": "Correo o contraseña incorrectos.", "Enter your email and password.": "Ingresa tu correo y contraseña.",
    "Filter by event date": "Filtrar por fecha del evento", "Filter by form": "Filtrar por formulario", "Search rows": "Buscar filas",
    "Download CSV": "Descargar CSV", "All events": "Todos los eventos", "All forms": "Todos los formularios", "Loading...": "Cargando...",
    "Summary": "Resumen", "Total": "Total", "Type": "Tipo", "Event date": "Fecha del evento", "Signed up": "Inscritos",
    "Will attend / volunteer": "Asistirán / serán voluntarios", "Need rides": "Necesitan transporte", "Can give rides": "Pueden dar transporte",
    "Can cook": "Pueden cocinar", "Can bake": "Pueden hornear", "Associate screeners": "Evaluadores asociados", "RSVPs": "Confirmaciones",
    "Meals reserved": "Comidas reservadas", "Photo release ok": "Autorización de fotos", "Members": "Miembros", "Meal RSVPs": "Confirmaciones de comida",
    "Contact messages": "Mensajes de contacto", "Fundraiser sign-ups": "Inscripciones a recaudaciones", "Service sign-ups": "Inscripciones a servicio",
    "Social sign-ups": "Inscripciones a eventos sociales", "FTV volunteers": "Voluntarios de FTV", 
    "Click to Join!": "¡Haz clic para unirte!", "Photos": "Fotos", "Service:": "Servicio:",
    "Koldus Building, Room 146 •": "Edificio Koldus, Salón 146 •", "AGLS Building, Room 419 •": "Edificio AGLS, Salón 419 •",
    "Pizza": "Pizza", "Donuts": "Donas", "Cookies": "Galletas", "Alaqmar Ratlamwala": "Alaqmar Ratlamwala"
  };

  var WD = {Sunday: "domingo", Monday: "lunes", Tuesday: "martes", Wednesday: "miércoles", Thursday: "jueves", Friday: "viernes", Saturday: "sábado"};
  var MO = {January: "enero", February: "febrero", March: "marzo", April: "abril", May: "mayo", June: "junio", July: "julio",
            August: "agosto", September: "septiembre", October: "octubre", November: "noviembre", December: "diciembre"};
  var ORD = {First: "Primera", Second: "Segunda", Third: "Tercera", Fourth: "Cuarta", Fifth: "Quinta", Sixth: "Sexta", Seventh: "Séptima"};

  var MONTHS_RE = Object.keys(MO).join("|"), WD_RE = Object.keys(WD).join("|");

  // Pattern fallbacks for text that is built from numbers/dates.
  function dateFix(s) {
    return s
      .replace(new RegExp("\\b(" + WD_RE + "),? (\\d{1,2})/(\\d{1,2})/(\\d{4})", "g"), function (m, w, mo, d, y) { return WD[w] + ", " + d + "/" + mo + "/" + y; })
      .replace(new RegExp("\\b(" + WD_RE + "),? (\\d{1,2})/(\\d{1,2})(?!\\d|/)", "g"), function (m, w, mo, d) { return WD[w] + " " + d + "/" + mo; })
      .replace(new RegExp("\\b(" + WD_RE + "), (" + MONTHS_RE + ") (\\d{1,2})(?:st|nd|rd|th)?, (\\d{4})", "g"), function (m, w, mo, d, y) { return WD[w] + ", " + d + " de " + MO[mo] + " de " + y; })
      .replace(new RegExp("\\b(" + MONTHS_RE + ") (\\d{1,2})(?:st|nd|rd|th)?, (\\d{4})", "g"), function (m, mo, d, y) { return d + " de " + MO[mo] + " de " + y; })
      .replace(new RegExp("\\b(" + MONTHS_RE + ") (\\d{1,2})(?:st|nd|rd|th)?\\b", "g"), function (m, mo, d) { return d + " de " + MO[mo]; })
      .replace(new RegExp("\\b(" + MONTHS_RE + ") (\\d{4})\\b", "g"), function (m, mo, y) { return MO[mo] + " de " + y; })
      .replace(new RegExp("\\b(" + WD_RE + ")\\b", "g"), function (m, w) { return WD[w]; });
  }

  function translate(core) {
    if (Object.prototype.hasOwnProperty.call(DICT, core)) return DICT[core];
    var m;
    // "First general meeting, slide 3 of 18"
    if ((m = core.match(/^(First|Second|Third|Fourth|Fifth|Sixth|Seventh) general meeting, slide (\d+) of (\d+)$/)))
      return "Diapositiva " + m[2] + " de " + m[3] + " de la " + ORD[m[1]].toLowerCase() + " reunión general";
    // Officer portal summary
    if ((m = core.match(/^(\d+) volunteer sign-ups, (\d+) need rides, (\d+) can screen, (\d+) meals reserved$/)))
      return m[1] + " inscripciones de voluntarios, " + m[2] + " necesitan transporte, " + m[3] + " pueden evaluar, " + m[4] + " comidas reservadas";
    if ((m = core.match(/^Could not load \((.*)\)$/))) return "No se pudo cargar (" + m[1] + ")";
    if ((m = core.match(/^Other: (.*)$/))) return "Otro: " + m[1];
    // Compound strings: "A · B · C" and "A • B"
    if (core.indexOf(" · ") > -1) return core.split(" · ").map(translate).join(" · ");
    var out = dateFix(core);
    if (out !== core && /^[A-Z]/.test(core)) out = out.charAt(0).toUpperCase() + out.slice(1);
    // Trailing bullet from "Wednesday, 10/21/2026, 5:30–6:30 PM •"
    return out;
  }

  function tr(raw) {
    var m = /^(\s*)([\s\S]*?)(\s*)$/.exec(raw);
    var core = m[2].replace(/\s+/g, " ");
    if (!core) return raw;
    var out = translate(core);
    return out === core ? raw : m[1] + out + m[3];
  }

  // ---------- DOM application ----------
  var ATTRS = ["placeholder", "alt", "title", "aria-label"];
  var SKIP = {SCRIPT: 1, STYLE: 1, TEXTAREA: 1, NOSCRIPT: 1, CODE: 1};
  var lang = "en";
  try { lang = localStorage.getItem("ffac-lang") === "es" ? "es" : "en"; } catch (e) {}
  var textRec = new WeakMap();   // text node -> {o: original, t: translated}
  var attrRec = new WeakMap();   // element -> {attr: {o, t}}
  var btn;

  function doText(node) {
    var rec = textRec.get(node);
    if (lang === "es") {
      if (rec && node.data === rec.t) return;
      var t = tr(node.data);
      textRec.set(node, {o: node.data, t: t});
      if (t !== node.data) node.data = t;
    } else if (rec && node.data === rec.t) {
      node.data = rec.o; textRec.delete(node);
    }
  }

  function doAttrs(el) {
    var rec = attrRec.get(el) || {};
    for (var i = 0; i < ATTRS.length; i++) {
      var a = ATTRS[i];
      if (!el.hasAttribute(a) || el.id === "lang-toggle") continue;
      var cur = el.getAttribute(a), r = rec[a];
      if (lang === "es") {
        if (r && cur === r.t) continue;
        var t = tr(cur);
        rec[a] = {o: cur, t: t};
        if (t !== cur) el.setAttribute(a, t);
      } else if (r && cur === r.t) {
        el.setAttribute(a, r.o); delete rec[a];
      }
    }
    attrRec.set(el, rec);
  }

  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) { if (!root.parentNode || !SKIP[root.parentNode.nodeName]) doText(root); return; }
    if (root.nodeType !== 1 || SKIP[root.nodeName] || root.id === "lang-toggle") return;
    doAttrs(root);
    for (var c = root.firstChild; c; c = c.nextSibling) walk(c);
  }

  function applyAll() {
    walk(document.documentElement);
    document.documentElement.lang = lang;
    if (btn) {
      btn.textContent = lang === "es" ? "English" : "Español";
      btn.setAttribute("aria-label", lang === "es" ? "Switch language to English" : "Cambiar el idioma a español");
    }
  }

  var observer = new MutationObserver(function (list) {
    for (var i = 0; i < list.length; i++) {
      var m = list[i];
      if (m.type === "characterData") walk(m.target);
      else if (m.type === "attributes") doAttrs(m.target);
      else for (var j = 0; j < m.addedNodes.length; j++) walk(m.addedNodes[j]);
    }
  });
  observer.observe(document.documentElement, {
    childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS
  });

  // confirm()/alert() text comes from scripts, so translate it too.
  ["alert", "confirm"].forEach(function (fn) {
    var orig = window[fn];
    window[fn] = function (msg) { return orig.call(window, lang === "es" ? tr(String(msg)) : msg); };
  });

  function setLang(l) {
    lang = l;
    try { localStorage.setItem("ffac-lang", l); } catch (e) {}
    applyAll();
  }

  function addButton() {
    var css = document.createElement("style");
    css.textContent =
      "#lang-toggle{position:fixed;right:16px;bottom:16px;z-index:9999;padding:10px 18px;border:2px solid #fff;" +
      "border-radius:999px;background:var(--maroon,#d95f0e);color:#fff;font:600 15px/1 inherit;font-family:inherit;" +
      "cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.3)}" +
      "#lang-toggle:hover{background:var(--maroon-dark,#b34a07)}" +
      "#lang-toggle:focus-visible{outline:3px solid var(--gold,#ffb066);outline-offset:2px}";
    document.head.appendChild(css);
    btn = document.createElement("button");
    btn.id = "lang-toggle"; btn.type = "button";
    btn.addEventListener("click", function () { setLang(lang === "es" ? "en" : "es"); });
    document.body.appendChild(btn);
    applyAll();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", addButton);
  else addButton();
  if (lang === "es") document.documentElement.lang = "es";
})();
