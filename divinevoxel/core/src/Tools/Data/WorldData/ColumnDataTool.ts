//objects
import { WorldRegister } from "../../../Data/World/WorldRegister.js";
import { EncodedPositionDataTool } from "../../Classes/DataToolBase.js";
import { Chunk } from "../../../Data/World/Classes/Chunk.js";
import { Column } from "../../../Data/World/Classes/Column.js";

export class ColumnDataTool extends EncodedPositionDataTool {
 tags = Column.Tags;
 _column = <Column>{};

 loadIn() {
  const column = WorldRegister.column.get(this.location);
  if (!column) return false;
  this.tags.setBuffer(column.columnState);
  this._c = column.columnState;
  this._column = column;
  return true;
 }

 setColumn(column: Column) {
  this.tags.setBuffer(column.columnState);
  this._c = column.columnState;
  this._column = column;
  return this;
 }

 getColumn() {
  return this._column;
 }

 getNumChunks() {
  return this._column.chunks.length;
 }

 getBufferSizeForWholeColumn() {
  return Column.Tags.tagSize + Column.Tags.tagSize * this.getNumChunks();
 }

 isStored() {
  return this.getTagValue("#dve_is_stored") == 1;
 }

 markAsNotStored() {
  this.setTagValue("#dve_is_stored", 0);
  return this;
 }

 markAsStored() {
  this.setTagValue("#dve_is_stored", 1);
  return this;
 }

 isPersistent() {
  return this.getTagValue("#dve_persistent") == 1;
 }

 setPersistence(value: boolean) {
  this.setTagValue("#dve_persistent", value ? 1 : 0);
 }

 isDirty() {
  return this.getTagValue("#dve_is_dirty") == 1;
 }

 setDirty(value: boolean) {
  this.setTagValue("#dve_is_dirty", value ? 1 : 0);
 }

 getLastSaveTimestamp() {
  return this.getTagValue("#dve_last_save_timestamp");
 }

 setLastSaveTimestamp() {
  return this.setTagValue("#dve_last_save_timestamp", Date.now());
 }

 getLastAnalyzerUpdateTimestamp() {
  return this.getTagValue("#dve_last_analyzer_update_timestamp");
 }

 setLastAnalyzerUpdateTimestamp() {
  return this.setTagValue("#dve_last_analyzer_update_timestamp", Date.now());
 }

 hasRichData() {
  return this.getTagValue("#dve_has_rich_data") == 1;
 }

 setRichData(value: boolean) {
  this.setTagValue("#dve_has_rich_data", value ? 1 : 0);
 }

 hasEntityData() {
  return this.getTagValue("#dve_has_entity_data") == 1;
 }

 setEntityData(value: boolean) {
  this.setTagValue("#dve_has_entity_data", value ? 1 : 0);
 }
}
