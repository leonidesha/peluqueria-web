import "./Home.css";
export default function Home() {
  return (
    <>
      <header className="header_home">
        <img className="imglogo_home" src="/public/icon.png" />
        <h2>Peluquería Tal!</h2>
        <button className="button_auth_home">Autentificarse</button>
      </header>
      <section className="main_home">
        <img src="/public/portada.jpg" className="img_main_home" />
        <div className="text_main_home">
          <h3 className="services_title_home">Nuestros servicios</h3>
          <div className="services_home">
            <div className="item_home">
              <img src="/public/corte.jpg" className="img_item_home" />
              <p>Corte</p>
            </div>
            <div className="item_home">
              <img src="/public/lavado.jpg" className="img_item_home" />
              <p>Lavado</p>
            </div>
            <div className="item_home">
              <img src="/public/tinte.jpg" className="img_item_home" />
              <p>Tinte</p>
            </div>
            <div className="item_home">
              <img src="/public/peinado.jpg" className="img_item_home" />
              <p>Peinado</p>
            </div>
          </div>
          <div className="horario_main_home">
            <div className="horario_home">
              <h4>Horario de atención</h4>
              <p>Lunes a Viernes: 9:00 - 18:00</p>
              <p>Sábados: 10:00 - 14:00</p>
            </div>
            <button className="button_reservar_home">Reservar</button>
          </div>
        </div>
      </section>
      <footer className="footer_home">
        <p className="contactanos_home">Contáctenos:</p>
        <a href="">Whatsapp</a>
        <a href="">Facebook</a>
        <a href="">Dirección</a>
      </footer>
    </>
  );
}
