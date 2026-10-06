//#region node_modules/.nitro/vite/services/ssr/assets/types-B71k4oFf.js
/** Classic four-echelon classroom chain (retailer → factory). */
var ROLES = [
	"retailer",
	"wholesaler",
	"distributor",
	"factory"
];
var ROLE_LABEL = {
	retailer: "Retailer",
	wholesaler: "Wholesaler",
	distributor: "Distributor",
	factory: "Factory"
};
var ROLE_SHORT = {
	retailer: "Campus store",
	wholesaler: "Wholesaler",
	distributor: "Distributor",
	factory: "Factory"
};
/** Immediate customer of each seat. Retailer sells to shoppers. */
var DOWNSTREAM = {
	retailer: null,
	wholesaler: "retailer",
	distributor: "wholesaler",
	factory: "distributor"
};
/** Who you order from. Factory orders production. */
var UPSTREAM = {
	retailer: "wholesaler",
	wholesaler: "distributor",
	distributor: "factory",
	factory: null
};
var ROLE_CUSTOMER = {
	retailer: "UNG campus shoppers",
	wholesaler: "the retailer",
	distributor: "the wholesaler",
	factory: "the distributor"
};
var ROLE_UPSTREAM = {
	retailer: "the wholesaler",
	wholesaler: "the distributor",
	distributor: "the factory",
	factory: "your production line"
};
var TEAM_NAMES = [
	"Dahlonega",
	"Gainesville",
	"Oconee",
	"Cumming",
	"Blue Ridge",
	"Watkinsville"
];
//#endregion
export { ROLE_SHORT as a, UPSTREAM as c, ROLE_LABEL as i, ROLES as n, ROLE_UPSTREAM as o, ROLE_CUSTOMER as r, TEAM_NAMES as s, DOWNSTREAM as t };
