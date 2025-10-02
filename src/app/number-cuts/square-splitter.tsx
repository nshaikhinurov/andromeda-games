import { useMemo } from "react";

// React-компонент разделения квадрата на части
// - Генерирует n многоугольных частей путем итеративного случайного разделения наибольшей части
// - Каждое разделение производится прямой линией (опционально ограничено кратными 360/k градусов)
// - Разделения, которые создают несбалансированные области или слишком удлиненные части, отклоняются
// - Возвращает SVG, где исходный квадрат залит желтым, а внутренние края нарисованы черным цветом толщиной 2px

// ПРИМЕЧАНИЕ (практическое приближение):
// Для "минимального ограничивающего прямоугольника" мы используем приблизительный метод: поворачиваем многоугольник
// через набор углов (каждые 5 градусов по умолчанию) и берем лучшее соотношение ширины/высоты.
// Это очень хорошее приближение для типичных многоугольников и намного проще, чем точные вращающиеся циркули.

// Типы
type Point = { x: number; y: number };
type Polygon = Point[];

type Options = {
  n: number; // желаемое количество частей
  svgSize?: number; // размер svg в пикселях (квадрат)
  angleQuantization?: number; // параметр квантования углов (если undefined или <=0, углы полностью случайны)
  S_ratio?: number; // максимально допустимое соотношение площадей (больший/меньший)
  B_ratio?: number; // максимально допустимое соотношение сторон ограничивающего прямоугольника
  max_attempts?: number; // попытки на каждого кандидата на разделение
  angleStepDeg?: number; // для приблизительной выборки min bbox
  enforceAngles?: boolean; // привязывать ли к кратным 360/k
  randomSeed?: number; // опциональное семя для детерминированного вывода
};

// Параметры по умолчанию
const DEFAULTS: Options = {
  n: 10,
  svgSize: 500,
  angleQuantization: 4,
  S_ratio: 2,
  B_ratio: 3,
  max_attempts: 10,
  angleStepDeg: 5,
  enforceAngles: true,
};

// Простой детерминированный ГПСЧ (mulberry32)
function makeRng(seed = Date.now()) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

// Функция перемешивания массива (алгоритм Фишера-Йейтса)
function shuffle<T>(array: T[], rng: () => number): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Геометрические вспомогательные функции
const eps = 1e-9;

// Алгоритм шнуровки (вычисление площади многоугольника)
function area(points: Polygon) {
  if (points.length < 3) {
    return 0; // у многоугольника меньше 3 точек нет площади
  }

  let sum = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length; // следующая вершина (с замыканием)
    sum += points[i].x * points[j].y - points[j].x * points[i].y;
  }

  return Math.abs(sum) / 2;
}

function centroid(poly: Polygon) {
  let cx = 0,
    cy = 0,
    A = 0;

  for (let i = 0; i < poly.length; i++) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    const cross = p.x * q.y - q.x * p.y;
    cx += (p.x + q.x) * cross;
    cy += (p.y + q.y) * cross;
    A += cross;
  }

  A = A / 2;
  if (Math.abs(A) < eps) return { x: poly[0].x, y: poly[0].y };
  cx /= 6 * A;
  cy /= 6 * A;
  return { x: cx, y: cy };
}

function distance(a: Point, b: Point) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function rotatePointAround({
  p,
  angleRad,
  center = { x: 0, y: 0 },
}: {
  p: Point;
  angleRad: number;
  center?: Point;
}) {
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);

  // переносим точку в систему координат центра
  const dx = p.x - center.x;
  const dy = p.y - center.y;

  // вращаем
  const xNew = dx * cos - dy * sin;
  const yNew = dx * sin + dy * cos;

  // возвращаем обратно
  return {
    x: xNew + center.x,
    y: yNew + center.y,
  };
}

function bboxOf(poly: Polygon) {
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  for (const p of poly) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  }
  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
    area: (maxX - minX) * (maxY - minY),
  };
}

// Приблизительное минимальное соотношение сторон ограничивающего прямоугольника путем выборки поворотов
function approxMinBBox(poly: Polygon, stepDeg = 2) {
  // возвращаем минимальную площадь ограничивающего прямоугольника
  const c = centroid(poly);
  let leastAreaFound = Infinity;
  let bestBox = null;
  for (let deg = 0; deg < 180; deg += stepDeg) {
    const rad = (deg * Math.PI) / 180;
    const rotated = poly.map((p) =>
      rotatePointAround({ p, angleRad: rad, center: c }),
    );
    const b = bboxOf(rotated);
    const area = b.area;
    if (area < leastAreaFound) {
      leastAreaFound = area;
      bestBox = b;
    }
  }
  return bestBox!;
}

// Пересечение отрезка (p1->p2) с бесконечной линией, определенной (a->b)
function segLineIntersection(
  p1: Point,
  p2: Point,
  a: Point,
  b: Point,
): Point | null {
  // отрезок p1p2 и отрезок ab (мы будем рассматривать ab как бесконечную линию для вызывающего)
  const x1 = p1.x,
    y1 = p1.y,
    x2 = p2.x,
    y2 = p2.y;
  const x3 = a.x,
    y3 = a.y,
    x4 = b.x,
    y4 = b.y;
  const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (Math.abs(denom) < eps) return null; // параллельны
  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
  const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
  // t в [0,1] означает, что пересечение лежит на отрезке p1p2; u относительно ab, но мы рассматриваем ab как бесконечную
  if (t < -eps || t > 1 + eps) return null;
  return { x: x1 + t * (x2 - x1), y: y1 + t * (y2 - y1) };
}

// Найти точки пересечения линии и многоугольника (линия определена точкой + угол)
// возвращает массив {pt, edgeIndex, tOnEdge}
function linePolygonIntersections({
  polygon,
  linePoint,
  angle,
}: {
  polygon: Polygon;
  linePoint: Point;
  angle: number;
}) {
  const intersections: { pt: Point; edgeIndex: number; t: number }[] = [];

  const dx = Math.cos(angle);
  const dy = Math.sin(angle);

  for (let i = 0; i < polygon.length; i++) {
    const a = polygon[i];
    const b = polygon[(i + 1) % polygon.length]; // замыкаем

    const ex = b.x - a.x;
    const ey = b.y - a.y;

    const denominator = dx * ey - dy * ex;

    if (Math.abs(denominator) < 1e-9) {
      // прямая и ребро параллельны → пересечения нет
      continue;
    }

    // решаем систему уравнений
    const t =
      ((a.x - linePoint.x) * ey - (a.y - linePoint.y) * ex) / denominator;
    const u =
      ((a.x - linePoint.x) * dy - (a.y - linePoint.y) * dx) / denominator;

    if (u >= 0 - eps && u <= 1 + eps) {
      intersections.push({
        pt: { x: linePoint.x + t * dx, y: linePoint.y + t * dy },
        edgeIndex: i,
        t: u,
      });
    }
  }

  return intersections;
}

// Утилита: вставить точку в многоугольник на позиции ребра и вернуть новый многоугольник
function insertPointAtEdge(poly: Polygon, edgeIndex: number, pt: Point) {
  const newPoly: Polygon = [];
  for (let i = 0; i < poly.length; i++) {
    newPoly.push(poly[i]);
    if (i === edgeIndex) newPoly.push(pt);
  }
  return newPoly;
}

// Разделить многоугольник линией, определенной двумя точками пересечения (предполагает ровно два пересечения и не в вершинах)
function splitPolygonByTwoPoints(
  polygon: Polygon,
  A: { pt: Point; edgeIndex: number; t: number },
  B: { pt: Point; edgeIndex: number; t: number },
) {
  const n = polygon.length;

  // Вставляем p1 после вершины edgeIndex1
  const polyWithP1 = [
    ...polygon.slice(0, A.edgeIndex + 1),
    A.pt,
    ...polygon.slice(A.edgeIndex + 1),
  ];

  // после вставки p1 индексы могут сдвинуться
  const shift = B.edgeIndex > A.edgeIndex ? 1 : 0;

  const polyWithP1P2 = [
    ...polyWithP1.slice(0, B.edgeIndex + 1 + shift),
    B.pt,
    ...polyWithP1.slice(B.edgeIndex + 1 + shift),
  ];

  // ищем индексы P1 и P2
  const i1 = polyWithP1P2.findIndex((p) => p === A.pt);
  const i2 = polyWithP1P2.findIndex((p) => p === B.pt);

  if (i1 === -1 || i2 === -1) {
    throw new Error("P1 или P2 не вставлены в многоугольник");
  }

  // строим два подполигона
  const poly1: Point[] = [];
  const poly2: Point[] = [];

  // идём от p1 до p2
  for (let i = i1; ; i = (i + 1) % polyWithP1P2.length) {
    poly1.push(polyWithP1P2[i]);
    if (i === i2) break;
  }
  poly1.push(A.pt); // замыкаем

  // идём от p2 до p1
  for (let i = i2; ; i = (i + 1) % polyWithP1P2.length) {
    poly2.push(polyWithP1P2[i]);
    if (i === i1) break;
  }
  poly2.push(B.pt); // замыкаем

  return [poly1, poly2];
}

// Проверить, находится ли точка внутри многоугольника (метод луча)
function pointInPolygon(pt: Point, poly: Polygon) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x,
      yi = poly[i].y;
    const xj = poly[j].x,
      yj = poly[j].y;
    const intersect =
      yi > pt.y !== yj > pt.y &&
      pt.x < ((xj - xi) * (pt.y - yi)) / (yj - yi + eps) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

// Получить случайную точку внутри многоугольника методом отбраковки на его bbox
function randomPointInPolygon(rng: () => number, poly: Polygon) {
  const b = bboxOf(poly);
  for (let i = 0; i < 2000; i++) {
    const p = { x: b.minX + rng() * b.width, y: b.minY + rng() * b.height };
    if (pointInPolygon(p, poly)) return p;
  }
  // запасной вариант - центроид
  return centroid(poly);
}

// Нормализовать ключ отрезка, чтобы общие ребра были равны независимо от направления
function segmentKey(a: Point, b: Point) {
  // округляем до фиксированной точности
  const prec = 4; // 0.0001 единиц в исходных координатах
  function r(v: number) {
    return Math.round(v * Math.pow(10, prec)) / Math.pow(10, prec);
  }
  const A = `${r(a.x)},${r(a.y)}`;
  const B = `${r(b.x)},${r(b.y)}`;
  return A < B ? `${A}|${B}` : `${B}|${A}`;
}

// Построить список уникальных отрезков из списка многоугольников
function uniqueSegments(polys: Polygon[]) {
  const map = new Map<string, [Point, Point]>();
  for (const poly of polys) {
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i];
      const b = poly[(i + 1) % poly.length];
      const key = segmentKey(a, b);
      if (!map.has(key)) map.set(key, [a, b]);
    }
  }
  return Array.from(map.values());
}

// Основной алгоритм разделения
function splitSquareIntoParts(optsIn: Options) {
  const opts = { ...DEFAULTS, ...optsIn } as Required<Options>;
  const rng = makeRng(opts.randomSeed ?? Date.now());
  const size = opts.svgSize;
  // исходный многоугольник квадрата (выровнен по осям, по часовой стрелке)
  const square: Polygon = [
    { x: 0, y: 0 },
    { x: size, y: 0 },
    { x: size, y: size },
    { x: 0, y: size },
  ];
  let pieces: Polygon[] = [square];

  for (let step = 0; step < opts.n - 1; step++) {
    // выбираем наибольшую часть по площади
    let idx = 0;
    let maxA = -1;
    for (let i = 0; i < pieces.length; i++) {
      const a = area(pieces[i]);
      if (a > maxA) {
        maxA = a;
        idx = i;
      }
    }
    const target = pieces[idx];

    let splitFound = false;
    for (let attempt = 0; attempt < opts.max_attempts; attempt++) {
      // выбираем случайную точку внутри цели
      const linePoint = randomPointInPolygon(rng, target);
      // выбираем угол
      let angleRad: number;
      if (opts.enforceAngles && opts.angleQuantization > 1) {
        const stepAngle = (2 * Math.PI) / opts.angleQuantization;
        const which = Math.floor(rng() * opts.angleQuantization);
        angleRad = which * stepAngle; // точные кратные в настоящее время; можно добавить небольшое смещение
      } else if (opts.angleQuantization > 1 && !opts.enforceAngles) {
        // разрешать только кратные, но со случайным выбором или полностью случайным? мы используем привязку к k с дрожанием
        const stepAngle = (2 * Math.PI) / opts.angleQuantization;
        const which = Math.floor(rng() * opts.angleQuantization);
        angleRad = which * stepAngle + (rng() - 0.5) * (stepAngle * 0.2);
      } else {
        angleRad = rng() * Math.PI; // направление и противоположное одна линия, поэтому 0..PI
      }

      // находим пересечения
      const hits = linePolygonIntersections({
        polygon: target,
        linePoint,
        angle: angleRad,
      });
      if (hits.length !== 2) continue;
      const A = hits[0];
      const B = hits[1];

      // Создаем два многоугольника
      const [p1, p2] = splitPolygonByTwoPoints(target, A, B);
      if (p1.length < 3 || p2.length < 3) continue;

      // соотношение площадей
      const a1 = area(p1);
      const a2 = area(p2);
      const big = Math.max(a1, a2);
      const small = Math.min(a1, a2);
      if (big / small > opts.S_ratio + 1e-9) continue;

      // проверки площадей ограничивающего прямоугольника (приблизительно)
      const bb1 = approxMinBBox(p1, opts.angleStepDeg);
      const bb2 = approxMinBBox(p2, opts.angleStepDeg);
      const bb1ratio = Math.max(bb1.width / bb1.height, bb1.height / bb1.width);
      const bb2ratio = Math.max(bb2.width / bb2.height, bb2.height / bb2.width);
      if (bb1ratio > opts.B_ratio || bb2ratio > opts.B_ratio) continue;

      // Принимаем разделение
      pieces.splice(idx, 1); // удаляем цель
      pieces.push(p1, p2);
      splitFound = true;
      break;
    }

    if (!splitFound) {
      // не можем разделить наибольшую часть в пределах попыток — останавливаемся рано
      console.warn(
        `splitSquareIntoParts: stopped early at ${pieces.length} parts (could not split further)`,
      );
      break;
    }

    if (pieces.length >= opts.n) break;
  }

  // Если у нас больше n частей (редко), оставляем n наибольших
  if (pieces.length > opts.n) {
    pieces.sort((a, b) => area(b) - area(a));
    pieces = pieces.slice(0, opts.n);
  }

  return pieces;
}

// Преобразовать многоугольники в SVG пути (многоугольники залиты пустотой, ребра нарисованы отдельно)
function polygonsToSvg(polys: Polygon[], rng: () => number) {
  const segs = uniqueSegments(polys);
  const paths: string[] = [];
  for (const [a, b] of segs) {
    // строим простой путь прямой линии
    paths.push(
      `M ${a.x.toFixed(4)} ${a.y.toFixed(4)} L ${b.x.toFixed(4)} ${b.y.toFixed(4)}`,
    );
  }

  // Перемешиваем полигоны
  const shuffledPolys = shuffle(polys, rng);

  // Вычисляем центроиды для каждого перемешанного полигона
  const polyData = shuffledPolys.map((poly, index) => ({
    polygon: poly,
    center: centroid(poly),
    number: index + 1,
  }));

  // также строим заливки многоугольников (нам нужна только заливка исходного квадрата; по запросу пользователя)
  return { segPaths: paths, polyData };
}

// Свойства React компонента
type Props = Partial<Options> & { className?: string };

export default function SquareSplitterSVG(props: Props) {
  const options: Options = {
    n: props.n ?? 8,
    svgSize: props.svgSize ?? DEFAULTS.svgSize!,
    angleQuantization: props.angleQuantization ?? 0,
    S_ratio: props.S_ratio ?? DEFAULTS.S_ratio!,
    B_ratio: props.B_ratio ?? DEFAULTS.B_ratio!,
    max_attempts: props.max_attempts ?? DEFAULTS.max_attempts!,
    angleStepDeg: props.angleStepDeg ?? DEFAULTS.angleStepDeg!,
    enforceAngles: props.enforceAngles ?? DEFAULTS.enforceAngles!,
    randomSeed: props.randomSeed ?? Math.floor(Math.random() * 2 ** 31),
  };

  const { segPaths, polyData } = useMemo(() => {
    const pieces = splitSquareIntoParts(options);
    const rng = makeRng(options.randomSeed);
    return polygonsToSvg(pieces, rng);
  }, [
    options.n,
    options.svgSize,
    options.angleQuantization,
    options.S_ratio,
    options.B_ratio,
    options.max_attempts,
    options.angleStepDeg,
    options.enforceAngles,
    options.randomSeed,
  ]);

  const size = options.svgSize!;
  return (
    <div>
      <span>Полигонов: {polyData.length} </span>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={props.className}
      >
        {/* заливка исходного квадрата желтым */}
        <rect
          x={0}
          y={0}
          width={size}
          height={size}
          fill="#ffeb3b"
          stroke="#000"
          strokeWidth={2}
        />
        {/* рисуем уникальные ребра */}
        <g stroke="#000" strokeWidth={2} fill="none" strokeLinecap="round">
          {segPaths.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
        {/* рисуем номера в центрах полигонов */}
        <g
          fill="#000"
          fontSize="20"
          fontFamily="Inter, sans-serif"
          textAnchor="middle"
          dominantBaseline="central"
        >
          {polyData.map((item, i) => (
            <text
              key={i}
              x={item.center.x.toFixed(2)}
              y={item.center.y.toFixed(2)}
              fontWeight="bold"
            >
              {item.number}
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
}

// Экспортируем вспомогательную функцию, если пользователь хочет необработанные многоугольники
export function generateSquareParts(opts: Options) {
  return splitSquareIntoParts(opts);
}
