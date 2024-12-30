import React from "react";

function About() {
  return (
    <>
      <h1 className="display-1 text-light pt-5" id="about">
        About
      </h1>
      <div className="accordion mt-5" id="accordionExample">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne"
            >
              Savor More, Spend Less: Cooking Made Simple and Satisfying
            </button>
          </h2>
          <div
            id="collapseOne"
            className="accordion-collapse collapse show"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body bg-warning">
              We believe you can create meals that make you proud—meals that are
              satisfying, nourishing, and worthy of sharing on social media.
              Meals so delicious, you'll actually look forward to the leftovers.
              And we believe you can achieve all of this without breaking the
              bank, investing in expensive kitchen gadgets, or spending hours in
              the kitchen. With us, you can spend less and savor more.
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo"
            >
              Your Trusted Guide to Culinary Exploration
            </button>
          </h2>
          <div
            id="collapseTwo"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body bg-warning">
              Whether you&apos;re passionate about creating culinary
              masterpieces or simply looking to expand your skills in the
              kitchen and explore new flavors, RecipeBook offers a captivating
              and reliable gateway into the art of cooking.
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseThree"
              aria-expanded="false"
              aria-controls="collapseThree"
            >
              Affordable Recipes, Perfected for Your Kitchen
            </button>
          </h2>
          <div
            id="collapseThree"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body bg-warning">
              At RecipeBook, every recipe is thoughtfully crafted and personally
              tested by our team of expert chefs. Each dish undergoes multiple
              rounds of testing to ensure it&apos;s simple, affordable, and
              irresistibly delicious before being shared with you. Quality and
              ease of preparation are our top priorities, guiding every recipe
              we create. Our mission is to bring you reliable, budget-friendly
              recipes you can trust and enjoy every time!
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
