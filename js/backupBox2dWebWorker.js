importScripts('lib/Box2d.js');

self.init = function (objects) {
	var fixtureDef, bodyDef, object, n;
	/* Our world. */
	self.world = new Box2D.Dynamics.b2World(
		new Box2D.Common.Math.b2Vec2(0.0, 0.0), /* Gravity. */
		true /* Allow sleep. */
	);
	self.world.scale = 32.0;
	self.remove = [];

	/* Global properties. */
	fixtureDef = new Box2D.Dynamics.b2FixtureDef();
	fixtureDef.density = 1.0;
	fixtureDef.friction = 0.0;
	fixtureDef.restitution = 0.0;
	bodyDef = new Box2D.Dynamics.b2BodyDef();

	/* Generate our walls. */
	for (n = 0; n < objects.walls.length; n = n + 1) {
		object = objects.walls[n];
		bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
		bodyDef.position.x = (object.x + object.width / 2.0) / self.world.scale;
		bodyDef.position.y = -(object.y + object.height / 2.0) / self.world.scale;
		fixtureDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
		fixtureDef.shape.SetAsBox(object.width / 2.0 / self.world.scale, object.height / 2.0 / self.world.scale);
		self.world.CreateBody(bodyDef).CreateFixture(fixtureDef).SetUserData({});
	}

	/* Add our points. */
	for (n = 0; n < objects.points.length; n = n + 1) {
		object = objects.points[n];
		bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
		bodyDef.position.x = (object.x + object.width / 2.0) / self.world.scale;
		bodyDef.position.y = -(object.y + object.height / 2.0) / self.world.scale;
		fixtureDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
		fixtureDef.shape.SetAsBox((object.width-25)/ 2.0 / self.world.scale, (object.height-25) / 2.0 / self.world.scale);
		object = self.world.CreateBody(bodyDef).CreateFixture(fixtureDef).SetUserData({
			tagName: 'point',
			index: n
		});
	}

	/* Add a box player. */
	bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
	bodyDef.position.x = (objects.startPoints[0].x + objects.startPoints[0].width / 2.0) / self.world.scale;
	bodyDef.position.y = -(objects.startPoints[0].y + objects.startPoints[0].height / 2.0) / self.world.scale;
	fixtureDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
	fixtureDef.shape.SetAsBox(32.0 / 2.0 / self.world.scale, 32.0 / 2.0 / self.world.scale);
	self.player = self.world.CreateBody(bodyDef);
	self.player.CreateFixture(fixtureDef).SetUserData({});
	self.player.j = [];
	self.player.contacts = 0;

	/* Collision listener for coins, portals, etc. */
	self.listener = new Box2D.Dynamics.b2ContactListener();
	self.listener.BeginContact = function (contact) {
/*		self.player.SetLinearVelocity(
			new Box2D.Common.Math.b2Vec2(
			0.0,
			0.0
			)
		);*/
		/* Only our player moves so it must be a player collision. */
		//self.player.contacts++;
		/* If there is a collision, find if one of the objects is a coin and, if so, remove that coin. */

		if (contact.m_fixtureB.GetUserData().tagName === 'point') {
			self.remove.push(contact.m_fixtureB.GetBody());
			self.postMessage({
				msg: 'remove',
				index: contact.m_fixtureB.GetUserData().index
			});
		} else if (contact.m_fixtureA.GetUserData().tagName === 'point') {
			self.remove.push(contact.m_fixtureA.GetBody());
			self.postMessage({
				msg: 'remove',
				index: contact.m_fixtureA.GetUserData().index
			});
		}
	};

	self.listener.EndContact = function () {
		/* Keep track of how many collisions are currently in effect for jumping purposes. */
		self.player.contacts--;
	};

	self.world.SetContactListener(self.listener);
	setInterval(self.update, 0.0167); /* Update the physics 60 times per second. */
	setInterval(self.cleanup, 0.0111); /* Check for object removal 90 times per second. */
};

self.cleanup = function () {
	var n;
	/* Cycle through and remove all outstanding bodies. */
	for (n = 0; n < self.remove.length; n = n + 1) {
	self.world.DestroyBody(self.remove[n]);
	self.remove[n] = null;
	}
	self.remove = [];
};

self.update = function () {
	/* If the player is not touching any floor, walls, or ceiling, eliminate any vertical (jumping) impulse. */
/*	if (self.player.contacts === 0) {
		self.player.j[1] = 0.0;
	}*/


	/* If there is no horizontal impulse, set the horizontal velocity to 0; prevents any sliding on the frictionless ground. */
	self.player.SetLinearVelocity(
			new Box2D.Common.Math.b2Vec2(
			0.0,
			0.0
			)
	);
	/* Apply the current horizontal and vertical impulse forces to our player. */
	self.player.ApplyImpulse(
		new Box2D.Common.Math.b2Vec2(self.player.j[0], self.player.j[1]),
		self.player.GetWorldCenter()
	);

	/* Cap the maximum horizontal velocities between -5.0 and 5.0. */
/*	self.player.SetLinearVelocity(
		new Box2D.Common.Math.b2Vec2(
			Math.max(-1.0, Math.min(self.player.GetLinearVelocity().x, 1.0)),
			Math.max(-1.0, Math.min(self.player.GetLinearVelocity().y, 1.0))
		)
	);*/
	/* Process the physics for this tick. */
	self.world.Step(
		0.0167, /* Frame rate based on milliseconds. */
		20, /* Velocity iterations. */
		20 /* Position iterations. */
	);
	/* Reset any forces. */
	//self.world.ClearForces();
	//self.player.j = [0.0, 0.0];

	self.postMessage({
		player: {
			x: self.player.GetPosition().x * self.world.scale,
			y: -self.player.GetPosition().y * self.world.scale,
			r: self.player.GetAngle()
		}
	});
};

self.addEventListener('message', function (e) {
	if (e.data.msg === 'ApplyImpulse') {
		self.player.j = e.data.j;
	} else if (e.data.msg === 'init') {
		self.init(e.data);
	}
});