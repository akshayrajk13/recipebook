import React from "react";
import nutella from "./images/Nutella Cookies.jpg";
import butterybiscuits from "./images/Buttery Shortbread Biscuits.jpg";
import cheesecake from "./images/Cheesecake.jpg";

function Cardgroup() {
  return (
    <div className="card-group gap-3 mt-5">
      <div className="card custom-card shadow rounded border-0">
        <img src={nutella} className="card-img-top custom-card-img" alt="1" />
        <div className="card-body">
          <h5 className="card-title">Nutella Stuffed Cookies</h5>
          <p className="card-text">
            I feel like the photos tell you everything you need to know to do a
            run to the grocery shop so you can make these immediately…
          </p>
        </div>
        <div className="card-footer bg-warning">
          <small className="text-body-secondary"></small>
        </div>
      </div>
      <div className="card custom-card shadow rounded border-0">
        <img
          src={butterybiscuits}
          className="card-img-top custom-card-img"
          alt="2"
        />
        <div className="card-body">
          <h5 className="card-title">Buttery Shortbread Biscuits</h5>
          <p className="card-text">
            Once fully cool, store in an airtight container in the pantry, not
            the fridge. They stay fresh for 5 days and still very, very good at
            7 days, making them excellent for... oh, I don&apos;t know. Selling
            at the counter of your hair salon?
          </p>
        </div>
        <div className="card-footer bg-warning">
          <small className="text-body-secondary"></small>
        </div>
      </div>
      <div className="card custom-card shadow rounded border-0">
        <img
          src={cheesecake}
          className="card-img-top custom-card-img"
          alt="3"
        />
        <div className="card-body">
          <h5 className="card-title">The Best No-Bake Cheesecake</h5>
          <p className="card-text">
            I am fiercely loyal to my classic baked cheesecake, but a no-bake
            version is perfect for hot summer days or when I&apos;m short on
            time because I don&apos;t have to fuss with baking.
          </p>
        </div>
        <div className="card-footer bg-warning">
          <small className="text-body-secondary"></small>
        </div>
      </div>
    </div>
  );
}

export default Cardgroup;
