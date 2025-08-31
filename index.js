const balls = [];

class Ball
{
	constructor(x, y, m)
	{
		this.pos = new Vector2(x, y);
		this.vel = 0                  // 속도
		this.m = m;                  // 질량
		this.r = this.m * 0.25;     // 반지름
		this.isColliding = false;  // 충돌 여부
	}

	static set_velocity(ball1, ball2)
	{
		let v1 = ball1.vel.x;
		let v2 = ball2.vel.x;

		const m1 = ball1.m;
		const m2 = ball2.m;

		const e = 1; // 반발계수

		let v1_x = ((e + 1) * m2 * v2 + v1 * (m1 - e * m2)) / (m1 + m2);
		let v2_x = ((e + 1) * m1 * v1 + v2 * (m2 - e * m1)) / (m1 + m2);

		ball1.vel.x = v1_x;
		ball2.vel.x = v2_x;

		let v1_y = ((e + 1) * m2 * ball2.vel.y + ball1.vel.y * (m1 - e * m2)) / (m1 + m2);
		let v2_y = ((e + 1) * m1 * ball1.vel.y + ball2.vel.y * (m2 - e * m1)) / (m1 + m2);

		ball1.vel.y = v1_y;
		ball2.vel.y = v2_y;

	}

	/**
	 * 충돌 감지 메소드
	 * @param {Ball} other 
	 */
	collisionDetection(other)
	{
		let distanceVec = Vector2.minus(this.pos, other.pos);
		let distance = distanceVec.dist();
		let sumRadius = this.r + other.r;

		if (distance < sumRadius)
		{
			this.isColliding = true;
			other.isColliding = true;

			this.pos.x += (this.r + other.r - distance) * (distanceVec.x / distance);
			Ball.set_velocity(this, other);
		}
	}

	edge() // 벽에 닿았을 때, 운동방향 역전전
	{
		if (this.pos.x > canvas.width - this.r)
		{
			this.pos.x = canvas.width - this.r;
			this.vel.x *= -1;
		}
		else if (this.pos.x < this.r)
		{
			this.pos.x = this.r;
			this.vel.x *= -1;
		}

		if (this.pos.y > canvas.height - this.r)
		{
			this.pos.y = canvas.height - this.r;
			this.vel.y *= -1;
		}
		else if (this.pos.y < this.r)
		{
			this.pos.y = this.r;
			this.vel.y *= -1;
		}
	}

	update()
	{
		this.vel.y += 1  // 중력 역할(단순히 아래 방향으로 작용하는 힘이지만)
		this.pos = Vector2.plus(this.pos, this.vel);
	}

	show()
	{
		if (this.isColliding)
		{
			ctx.beginPath()
			ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2);
			ctx.closePath();
			ctx.fillStyle = 'red';
			ctx.fill();
			ctx.fillStyle = 'black';
		}
		else
		{
			ctx.beginPath()
			ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2);
			ctx.closePath();
			ctx.fillStyle = 'blue';
			ctx.fill();
			ctx.fillStyle = 'black';
		}
	}
}

function init()
{
	balls.push(new Ball(100, 360, 300));
	balls.push(new Ball(600, 360, 150));
	// balls.push(new Ball(800, 360, 200));
	balls.push(new Ball(900, 360, 250));

	balls[0].vel = new Vector2(3, 0);
	balls[1].vel = new Vector2(6, 0);
	// balls[2].vel = new Vector2(-10, 0);
	balls[2].vel = new Vector2(-12, 0);
}

function update()
{
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	for (let i = 0; i < balls.length; i++) 
	{
		balls[i].isColliding = false;
	}

	for (let i = 0; i < balls.length; i++)
	{
		for (let j = i + 1; j < balls.length; j++)
		{
			if (i !== j)
			{
				balls[i].collisionDetection(balls[j]);
			}
		}
	}

	for (let ball of balls)
	{
		ball.update();
		ball.edge();
		ball.show();
	}
}

init();


// 프레임 제어
let stop = false;
let frameCount = 0;
let fps = 60, fpsInterval, startTime, now, then, elapsed;


function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    animate();
}

function animate() {
    requestAnimationFrame(animate);

    now = Date.now();
    elapsed = now - then;

    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
		    update();
    }
}

addEventListener('keydown', function(e) {
	if (e.key == 'a')
	{
		startAnimating(60);
	}
})
