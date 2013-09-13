importScripts('lib/Box2d.js');

self.init = function (objects) {
    var fixtureDef, bodyDef, object, n;
    /* Our world. */
    self.world = new Box2D.Dynamics.b2World(
        new Box2D.Common.Math.b2Vec2(0.0, 0.0), /* Gravity. */
        false /* Allow sleep. */
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
        fixtureDef.isSensor = true;
        //self.world.CreateBody(bodyDef).CreateFixture(fixtureDef).SetUserData({});
        object = self.world.CreateBody(bodyDef).CreateFixture(fixtureDef).SetUserData({
            tagName: 'wall',
            index: n
        });
    }

    /* Add our points. */
    for (n = 0; n < objects.points.length; n = n + 1) {
        object = objects.points[n];
        bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
        bodyDef.position.x = (object.x + object.width / 2.0) / self.world.scale;
        bodyDef.position.y = -(object.y + object.height / 2.0) / self.world.scale;
        fixtureDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
        fixtureDef.shape.SetAsBox((object.width) / 2.0 / self.world.scale, (object.height) / 2.0 / self.world.scale);
        object = self.world.CreateBody(bodyDef).CreateFixture(fixtureDef).SetUserData({
            tagName: 'point',
            index: object.x+","+object.y
        });
    }

    self.player = {};
    self.player.body = [];
    self.player.contacts = 0;
    self.player.x = 0;
    self.player.y = 0;
    self.player.direction;

    bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
    bodyDef.position.x = 0;
    bodyDef.position.y = 0;
    fixtureDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
    fixtureDef.shape.SetAsBox(1.0 / 2.0 / self.world.scale, 1.0 / 2.0 / self.world.scale);
    fixtureDef.isSensor = true;
    self.player.playerCollision = self.world.CreateBody(bodyDef);
    self.player.playerCollision.CreateFixture(fixtureDef).SetUserData({
        tagName: 'playerCollision',
        index: 1
    });

    /* Collision listener for coins, startPoints, etc. */
    self.listener = new Box2D.Dynamics.b2ContactListener();
    self.listener.BeginContact = function (contact) {
        var tag;

        /* Only our player moves so it must be a player collision. */
        //self.player.contacts++;
        /* If there is a collision, find if one of the objects is a coin and, if so, remove that coin. */
        if (self.player.direction === 1 || self.player.direction === 2) {
            tag = "playerVerticalCollision";
        } else {
            tag = "playerHorizontalCollision";
        }

        tag = "playerCollision";

        if ((contact.m_fixtureB.GetUserData().tagName === 'body') && (contact.m_fixtureA.GetUserData().tagName === tag)) {
            self.player.contacts++;
            self.postMessage({
                msg: 'body',
            });
        }

        if ((contact.m_fixtureB.GetUserData().tagName === 'wall') && (contact.m_fixtureA.GetUserData().tagName === tag)) {
            self.player.contacts++;
            self.postMessage({
                msg: 'wall',
            });
        }

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
        self.player.contacts--;
    };

    self.world.SetContactListener(self.listener);
    //setInterval(self.update, 0.0167); /* Update the physics 60 times per second. */
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

self.update = function () {};

self.addEventListener('message', function (e) {
    if (e.data.msg === 'ApplyImpulse') {
        //body movement
        //if there are new pieces to the body
        if (e.data.body.length > self.player.body.length) {
            for (var i = self.player.body.length; i < e.data.body.length; i++) {
                self.player.body.push(CreatePlayerBody(e.data.body[i].x, e.data.body[i].y, 4));
            }
        }

        for (var i = 0; i < e.data.body.length; i++) {
            self.player.body[i].SetPosition(
                new Box2D.Common.Math.b2Vec2(
                    e.data.body[i].x / self.world.scale, -e.data.body[i].y / self.world.scale
                )
            );

        }

        //headmovement
        self.player.direction = e.data.direction;
        switch (e.data.direction) {
        case 1:
            self.player.playerCollision.SetPosition(
                new Box2D.Common.Math.b2Vec2(
                    (e.data.x - 15) / self.world.scale, -e.data.y / self.world.scale
                )
            );
            break;
        case 2:
            self.player.playerCollision.SetPosition(
                new Box2D.Common.Math.b2Vec2(
                    (e.data.x + 15) / self.world.scale, -e.data.y / self.world.scale
                )
            );

            break;
        case 3:
            self.player.playerCollision.SetPosition(
                new Box2D.Common.Math.b2Vec2(
                    e.data.x / self.world.scale, -(e.data.y + 15) / self.world.scale
                )
            );

            break;
        case 4:
            self.player.playerCollision.SetPosition(
                new Box2D.Common.Math.b2Vec2(
                    e.data.x / self.world.scale, -(e.data.y - 15) / self.world.scale
                )
            );
            break;
        }

        if(e.data.pointToAdd) {
            AddPoint(e.data.pointToAdd);
        }

        self.world.Step(
            0.0167, /* Frame rate based on milliseconds. */
            20, /* Velocity iterations. */
            20 /* Position iterations. */
        );

        if (self.player.contacts <= 0) {
            self.player.contacts = 0;
            self.postMessage({
                msg: 'no prob'
            });
        }

    } else if (e.data.msg === 'init') {
        self.init(e.data);
    }
});

function CreatePlayerBody(x, y) {
    var body;
    var tag;
    var fixtureDef = new Box2D.Dynamics.b2FixtureDef();
    fixtureDef.density = 1.0;
    fixtureDef.friction = 0.0;
    fixtureDef.restitution = 0.0;
    var bodyDef = new Box2D.Dynamics.b2BodyDef();

    bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
    bodyDef.position.x = x / self.world.scale;
    bodyDef.position.y = -y / self.world.scale;
    fixtureDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
    fixtureDef.shape.SetAsBox(30.0 / 2.0 / self.world.scale, 30.0 / 2.0 / self.world.scale);

    body = self.world.CreateBody(bodyDef);
    body.CreateFixture(fixtureDef).SetUserData({
        tagName: 'body',
        index: 1
    });
    return body;
}

function AddPoint(point) {
    var x = parseInt(point.split(",")[0]);
    var y = parseInt(point.split(",")[1]);

    var fixtureDef = new Box2D.Dynamics.b2FixtureDef();
    fixtureDef.density = 1.0;
    fixtureDef.friction = 0.0;
    fixtureDef.restitution = 0.0;
    var bodyDef = new Box2D.Dynamics.b2BodyDef();
    bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
    bodyDef.position.x = (x + 16) / self.world.scale;
    bodyDef.position.y = -(y + 16 / 2.0) / self.world.scale;
    fixtureDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
    fixtureDef.shape.SetAsBox((32) / 2.0 / self.world.scale, (32) / 2.0 / self.world.scale);
    object = self.world.CreateBody(bodyDef).CreateFixture(fixtureDef).SetUserData({
        tagName: 'point',
        index: x+","+y
    });
}
