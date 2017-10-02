const net = require('net'),
	_ = require('lodash');

const dbSystemServiceController = require('./dbSystemService');
const dbMapServiceController = require('./dbMapService');

_.set(exports, 'buildDynamicCaucasus', function () {
	console.log('build dynamic caucasus');
	/*
		side lua addon:
			build static updator for static buildings - ctld buildings, supply and demand

		1. On Connection:
			a. if server unit database (after initial pull) is less than 100 units, run this function
			b. on dynamic dcs disconnects and reconnects, if over 100 units, pull a fresh replacement to the dynamic dcs data, do NOT run this function
			c. if 1 side owns ALL of the farps and bases of the map, give all people responsible (and not a traitor), a good helping of points to spend on next run.
			d. setup backend flags on which slot can be occupied and not, prob switch this to simple lua local table, for lua to use

		2. build map
			a. build farp support
			b. build defenses
			c. build ctld statics - map who owns them by name

		3. nodeJS runtime loop
			a. every player and moving AI (determined by name)) distance detector,
				1. run through conditions depending on distance, ctld crates, troop pickup, base capture
				2. ctld pickup locations and ctld crates for deployment and distance from main base
				3. write a common lat, long distance calculator
				4. write a runtime loop updator for player f10 options based on conditions, spending points, bases(location currently)

		4. Misc
			a. JTAC script, distance checker between line of sight items, lase and smoke/illuminate at night (user laser code determined by setting on website settings, must have account)
			b. think about supply and demand system, warehouses that supply items to a base, spawn in moving units to signify those supplys, can be destroyed in transit
			c. special f10 options to use points on, strikes, escort CAP fighter or atk heli, extremely rare and expensive arms, 120's r77 27et etc
			d. pickup down pilots for points (can be virtual, they get near reported point, spawn unit and smoke)
			e. forward operating base to run like CTLD command center, same rules as ctld




	 */

});
