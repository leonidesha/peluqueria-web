import "./Home.css";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";

interface Appointment {
  id: string;
  [key: string]: any; // This allows for other properties from doc.data()
}

export default function Home() {
  function handleClickAuth() {
    // Logic for authentication button click
    console.log("Authentication button clicked");
    console.log("User:", user);
    console.log("Appointments:", appointments);
  }
  const [user] = useState({
    displayname: "Hansel Rodriguez",
    email: "hansel.lunrak@gmail.com",
    uid: "abc123xyz",
  });
  //type Appointment = { id: string } & Record<string, any>;
  //const [appointments, setAppointments] = useState<Appointment | null>(null);
  const [appointments, setAppointments] = useState<Appointment | null>(null);
  useEffect(() => {
    const loadAppointment = async () => {
      try {
        const q = query(
          collection(db, "Appointments"),
          where("userId", "==", "abc123xyz")
        );
        console.log("EJECUTANDO QUERY");
        console.log("Query:", q);
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          console.log(doc);
          setAppointments({ id: doc.id, ...doc.data() });
        }
      } catch (error) {
        console.error("Error al cargar la cita:", error);
      }
    };
    loadAppointment();
  }, []);

  return (
    <>
      <header className="header_home">
        <img className="imglogo_home" src="/public/icon.png" />
        <h2>Peluquería Tal!</h2>
        <button onClick={handleClickAuth} className="button_auth_home">
          Autentificarse
        </button>
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
