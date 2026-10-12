<img src="assets/ant-group-symbol.png" height="28" alt="Ant Group">

# ECG-RSI

**Recursive Self-Improvement through Targeted ECG Waveform Evolution**

Turn learner errors into the next generation of verified ECG supervision.

[Paper](papers/ecg-rsi.pdf) · [Project page](https://pork-pay.github.io/ECG-RSI/) · [GitHub](https://github.com/pork-pay/ECG-RSI) · [LaTeX source](papers/ECG_RSI_arXiv.zip)

[![ECG-RSI evolution: edit the waveform, verify supervision, compare interventions, and change the next batch.](assets/ecg-evolution.gif)](https://pork-pay.github.io/ECG-RSI/#evolution)

**[Watch the evolution loop →](https://pork-pay.github.io/ECG-RSI/#evolution)**

- **Verify the example.** Construction feedback repairs waveform operators and checks target and protected features.
- **Compare ways to teach.** Learner errors propose interventions; matched branches and a separate selection set determine which to retain.
- **Change the next batch.** The retained recipe guides subsequent synthesis and sampling.

The animation illustrates the mechanism. The paper’s [recorded waveform example](https://pork-pay.github.io/ECG-RSI/#method) requests PR 300 ms and remeasures 298 ms, under its automatic measurement convention.

## Reported findings

The retained intervention shifts from direct reinforcement to confusion contrasts. Successive external S7 gains diminish: **+13.07 → +3.01 → +0.38** points.

| Mean metric | Starting model | After three rounds |
| --- | ---: | ---: |
| QA accuracy | 34.57% | 56.04% |
| Classification F1 | 24.27 | 34.03 |

Qwen3.5-35B-A3B; main trajectory R-A. S7 averages four accuracy and three F1 scores on a 0–100 scale. [Experiment details.](https://pork-pay.github.io/ECG-RSI/#findings)

## Authors

<p>
      <span><a href="https://openreview.net/profile?id=~Wang_Xiaoliang2">Xiaoliang Wang</a><sup>1,2,*</sup></span>,
      <span><a href="https://openreview.net/profile?id=~Zhuo_Chen3">Zhuo Chen</a><sup>2,*</sup></span>,
      <span><a href="https://openreview.net/profile?id=~Chuanyang_Zheng2">Chuanyang Zheng</a><sup>2</sup></span>,
      <span><a href="https://openreview.net/profile?id=~Jiangwei_Lao1">Jiangwei Lao</a><sup>2</sup></span>,
      <span><a href="https://openreview.net/profile?id=~Quanbin_Wang1">Quanbin Wang</a><sup>2</sup></span>,
      <span><a href="https://openreview.net/profile?id=~Honglin_Lin2">Honglin Lin</a><sup>3,4</sup></span>,
      <span><a href="https://openreview.net/profile?id=~Jiajia_Liu1">Jiajia Liu</a><sup>2</sup></span>,
      <span><a href="https://openreview.net/profile?id=~Zhihong_Lu2">Zhihong Lu</a><sup>2</sup></span>,
      <span><a href="https://openreview.net/profile?id=~Hao_Jin4">Hao Jin</a><sup>1</sup></span>,
      <span><a href="https://openreview.net/profile?id=~Jian_Wang25">Jian Wang</a><sup>2</sup></span>,
      <span><a href="https://openreview.net/profile?id=~Lijun_Wu1">Lijun Wu</a><sup>3,4,†</sup></span>
    </p>

<p>
      <sup>1</sup> Zhejiang University · <sup>2</sup> Ant Group ·
      <sup>3</sup> Shanghai Artificial Intelligence Laboratory · <sup>4</sup> Shanghai Jiao Tong University</p>

<sup>*</sup> Equal contribution. <sup>†</sup> Corresponding author.

## Materials

This repository provides the paper, LaTeX source and static project page. Training/synthesis implementation, model weights and training data are not included.

Preview locally: `python3 -m http.server 8000`, then open `http://localhost:8000`. No build step is required.

Related: [MedEvo](https://pork-pay.github.io/MedEvo/) preserves and repairs medical reasoning trajectories.

<details>
<summary>Citation</summary>

```bibtex
@misc{wang2026ecgrsi,
  title = {ECG-RSI: Recursive Self-Improvement through Targeted ECG Waveform Evolution},
  author = {Wang, Xiaoliang and Chen, Zhuo and Zheng, Chuanyang and Lao, Jiangwei and Wang, Quanbin and Lin, Honglin and Liu, Jiajia and Lu, Zhihong and Jin, Hao and Wang, Jian and Wu, Lijun},
  year = {2026},
  url = {https://pork-pay.github.io/ECG-RSI/}
}
```

</details>
