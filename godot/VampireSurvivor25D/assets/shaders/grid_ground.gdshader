shader_type canvas_item;

// 2.5D 网格地面 - 俯视角透视网格
uniform vec4 grid_color : source_color = vec4(0.15, 0.13, 0.32, 1.0);
uniform vec4 bg_color : source_color = vec4(0.08, 0.08, 0.14, 1.0);
uniform float grid_size : hint_range(16, 256) = 64.0;
uniform float line_width : hint_range(0.5, 4.0) = 1.2;

void fragment() {
    vec2 uv = FRAGCOORD.xy;
    vec2 grid = fract(uv / grid_size);
    float line_x = step(grid.x, line_width / grid_size) + step(1.0 - line_width / grid_size, grid.x);
    float line_y = step(grid.y, line_width / grid_size) + step(1.0 - line_width / grid_size, grid.y);
    float line = clamp(line_x + line_y, 0.0, 1.0);
    // 渐晕
    float vignette = length((UV - 0.5) * 1.2);
    vignette = 1.0 - clamp(vignette, 0.0, 1.0) * 0.25;
    vec4 col = mix(bg_color, grid_color, line * 0.45);
    col.rgb *= vignette;
    // 远处淡出
    COLOR = col;
}
