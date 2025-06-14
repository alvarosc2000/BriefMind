class SubscriptionPlan {
  constructor({ name, priceRange, briefsIncluded, pricePerExtraBrief, description, priceId }) {
    this.name = name;
    this.priceRange = priceRange;
    this.briefsIncluded = briefsIncluded;
    this.pricePerExtraBrief = pricePerExtraBrief;
    this.description = description;
    this.priceId = priceId;
  }

  calculateExtraCost(extraBriefs) {
    const cost = parseFloat(this.pricePerExtraBrief.replace(/[^0-9.]/g, ""));
    return cost * extraBriefs;
  }

  hasBriefsAvailable(briefsUsed) {
    return briefsUsed < this.briefsIncluded;
  }
}

module.exports = SubscriptionPlan;
