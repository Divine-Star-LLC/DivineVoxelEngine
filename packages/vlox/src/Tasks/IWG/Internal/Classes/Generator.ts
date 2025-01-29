import { Vector3Like } from "@amodx/math";
import { Circle } from "@amodx/math/Shapes";
import { WorldSpaces } from "../../../../World/WorldSpaces";

export interface GeneratorData {
  dimension: string;
  building?: boolean;
  culling?: boolean;
  position: Vector3Like;
  renderRadius: number;
  generationRadius: number;
  maxRadius: number;
}

export class Generator {
  position: Vector3Like;
  _dimension = "main";
  _building = true;
  _positonChanged = false;
  _waitingForCull = false;
  _cullTime = 0;
  _culling = true;
  _cachedPosition = Vector3Like.Create();
  _sectorPosition = Vector3Like.Create();
  _genCircle = new Circle({ x: 0, y: 0 }, 0);
  _renderCircle = new Circle({ x: 0, y: 0 }, 0);
  _maxCircle = new Circle({ x: 0, y: 0 }, 10);

  constructor(data: GeneratorData) {
    this._dimension = data.dimension;
    this.position = data.position;
    this._building =
      typeof data.building !== "undefined" ? data.building : true;
    this._culling = typeof data.culling !== "undefined" ? data.culling : true;
    this._renderCircle.radius = data.renderRadius;
    this._genCircle.radius = data.generationRadius;
    this._maxCircle.radius = data.maxRadius;
  }

  update() {
    this._positonChanged = false;

    Vector3Like.Copy(
      this._sectorPosition,
      WorldSpaces.sector.getPositionXYZ(
        this.position.x,
        this.position.y,
        this.position.z
      )
    );

    if (!Vector3Like.Equals(this._sectorPosition, this._cachedPosition)) {
      this._positonChanged = true;
      Vector3Like.Copy(this._cachedPosition, this._sectorPosition);
    }

    this._renderCircle.center.x = this._sectorPosition.x;
    this._renderCircle.center.y = this._sectorPosition.z;

    this._genCircle.center.x = this._sectorPosition.x;
    this._genCircle.center.y = this._sectorPosition.z;

    this._maxCircle.center.x = this._sectorPosition.x;
    this._maxCircle.center.y = this._sectorPosition.z;
  }
}
