
const N = 1e9
class SegNode {
  constructor() {
    this.left = this.right = null // 左右孩子节点
    this.val = this.add = 0 // 懒惰标记 add，当前节点值val
  }
}

class SegmentTree {
  constructor() {
    this.root = new SegNode()
  }
  // 更新
  update(node, start, end, l, r, val) {
    // 找到满足要求的区间
    if (l <= start && end <= r) {
      // 区间节点加上更新值
      node.val += (end - start + 1) * val
      node.add += val
      return
    }
    const mid = start + end >> 1

    // 下推标记
    // mid - start + 1：表示左孩子区间叶子节点数量
    // end - mid：表示右孩子区间叶子节点数量
    this.pushDown(node,mid - start + 1, end - mid)
    // [start, mid] 和 [l, r] 可能有交集，遍历左孩子区间
    if (l <= mid) { this.update(node.left, start, mid, l, r, val) }
    // [mid + 1, end] 和 [l, r] 可能有交集，遍历右孩.子区间
    if (r > mid) { this.update(node.right, mid + 1, end, l, r, val) }
    // 向上更新
    this.pushUp(node)
  }
  // 查询
  query(node, start, end, l, r) {
    if (l <= start && end <= r) { return node.val }
    let ans = 0, mid = start + end >> 1
    this.pushDown(node, mid - start + 1, end - mid)
    if (l <= mid) { ans += this.query(node.left, start, mid, l, r) }
    if (r > mid) { ans += this.query(node.right, mid + 1, end, l, r) }
    return ans
  }
  pushUp(node) {
    node.val = node.left.val + node.right.val;
  }
  pushDown(node, leftNum, rightNum) {
    // 动态开点
    if (node.left === null) {node.left = new SegNode()}
    if (node.right === null) {node.right = new SegNode()}
    if (node.add === 0) {return}
    // 注意：当前节点加上 标记值✖该子树所有叶子节点的数量
    node.left.val += node.add * leftNum
    node.right.val += node.add * rightNum
    // 对区间进行「加减」的更新操作，下推懒惰标记时需要累加起来，不能直接覆盖
    node.left.add += node.add
    node.right.add += node.add
    // 取消当前节点标记,已经用过了
    node.add = 0
  }
}

