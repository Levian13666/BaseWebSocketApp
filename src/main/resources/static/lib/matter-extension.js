function rotateAroundPoint(body, rotation, point) {
    var cos = Math.cos(rotation),
        sin = Math.sin(rotation),
        dx = body.position.x - point.x,
        dy = body.position.y - point.y;

    Matter.Body.setPosition(body, {
        x: point.x + (dx * cos - dy * sin),
        y: point.y + (dx * sin + dy * cos)
    });

    Matter.Body.rotate(body, rotation);
}