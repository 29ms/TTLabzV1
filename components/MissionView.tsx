import React, { useState } from 'react';
import { Mission } from '../types';
import { geminiService } from '../services/geminiService';

interface MissionViewProps {
  mission: Mission;
  onExit: () => void;
  onComplete: (missionId: string) => void;
}

const MissionView: React.FC<MissionViewProps> = ({ mission: initialMission, onExit, onComplete }) => {
  const [currentMission, setCurrentMission] = useState<Mission>(initialMission);
  const [response, setResponse] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingFollowUp, setIsGeneratingFollowUp] = useState(false);
  const [isFollowUp, setIsFollowUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!response.trim()) return;
    setIsSubmitting(true);

    try {
      const feedbackText = await geminiService.getMentorFeedback(
        `PROJECT CONTEXT: ${currentMission.scenario}\nPROJECT TASK: ${currentMission.task}`,
        response,
      );
      setFeedback(feedbackText);
    } catch (err) {
      setError('Unable to review this response right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateFollowUp = async () => {
    if (!feedback) return;
    setIsGeneratingFollowUp(true);

    try {
      const followUp = await geminiService.generateSimilarMission(currentMission, response, feedback);
      setCurrentMission(followUp);
      setResponse('');
      setFeedback(null);
      setIsFollowUp(true);
    } catch (err) {
      setError('Unable to generate a follow-up step.');
    } finally {
      setIsGeneratingFollowUp(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#F9FAFB]">
      <div className="mx-auto grid min-h-screen max-w-[1400px] grid-cols-1 md:grid-cols-[380px_1fr]">
        <aside className="border-b border-[#1F2937] bg-[#111827] p-6 md:border-b-0 md:border-r md:p-8">
          <button
            onClick={onExit}
            className="mb-6 h-10 rounded-lg border border-[#1F2937] px-4 text-sm font-medium text-[#9CA3AF] transition-all duration-200 ease-out hover:border-white hover:text-[#F9FAFB]"
          >
            Back to Home
          </button>

          <p className="text-sm text-[#9CA3AF]">Project Step</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#F9FAFB]">{currentMission.title}</h1>
          <p className="mt-3 text-sm text-[#9CA3AF]">{currentMission.description}</p>

          <section className="mt-6 rounded-xl border border-[#1F2937] bg-[#0B0F14] p-4">
            <h2 className="text-sm font-medium text-[#F9FAFB]">Context</h2>
            <p className="mt-2 text-sm text-[#9CA3AF]">{currentMission.scenario}</p>
          </section>

          <section className="mt-4 rounded-xl border border-[#1F2937] bg-[#0B0F14] p-4">
            <h2 className="text-sm font-medium text-[#F9FAFB]">Objective</h2>
            <p className="mt-2 text-sm text-[#9CA3AF]">{currentMission.task}</p>
          </section>

          <section className="mt-4 rounded-xl border border-[#1F2937] bg-[#0B0F14] p-4">
            <h2 className="text-sm font-medium text-[#F9FAFB]">Output Standard</h2>
            <ul className="mt-2 space-y-2 text-sm text-[#9CA3AF]">
              <li>Explain the core concept clearly.</li>
              <li>Apply a concrete method.</li>
              <li>Produce structured output.</li>
              <li>Add reflection and next improvements.</li>
            </ul>
          </section>

          {isFollowUp && (
            <p className="mt-4 rounded-lg border border-[#1F2937] bg-[#0B0F14] p-3 text-sm text-[#9CA3AF]">
              Follow-up step active for deeper project quality.
            </p>
          )}
        </aside>

        <main className="relative p-6 md:p-8">
          {isGeneratingFollowUp && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0B0F14]/90">
              <div className="rounded-xl border border-[#1F2937] bg-[#111827] px-6 py-5 text-sm text-[#9CA3AF]">
                Generating follow-up project step...
              </div>
            </div>
          )}

          {!feedback ? (
            <section className="rounded-xl border border-[#1F2937] bg-[#111827] p-6">
              <h2 className="text-xl font-semibold text-[#F9FAFB]">Write your structured response</h2>
              <p className="mt-2 text-sm text-[#9CA3AF]">Use this format to make your work portfolio-ready.</p>

              <textarea
                className="mt-4 min-h-[340px] w-full rounded-lg border border-[#1F2937] bg-[#0B0F14] p-4 text-sm text-[#F9FAFB] outline-none transition-all duration-200 ease-out placeholder:text-[#6B7280] focus:border-white"
                placeholder={'Concept\n-\n\nMethod\n-\n\nOutput\n-\n\nReflection\n-'}
                value={response}
                onChange={(event) => setResponse(event.target.value)}
              />

              {error && <p className="mt-3 text-sm text-red-300">{error}</p>}

              <div className="mt-4 flex justify-end">
                <button
                  disabled={isSubmitting || !response.trim()}
                  onClick={handleSubmit}
                  className="h-10 rounded-lg bg-white px-5 text-sm font-medium text-black transition-all duration-200 ease-out hover:bg-zinc-200 disabled:opacity-50"
                >
                  {isSubmitting ? 'Reviewing...' : 'Submit for Review'}
                </button>
              </div>
            </section>
          ) : (
            <section className="rounded-xl border border-[#1F2937] bg-[#111827] p-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold text-[#F9FAFB]">Mentor Feedback</h2>
                <button
                  onClick={() => setFeedback(null)}
                  className="h-9 rounded-lg border border-[#1F2937] px-3 text-sm font-medium text-[#9CA3AF] transition-all duration-200 ease-out hover:border-white hover:text-[#F9FAFB]"
                >
                  Revise Response
                </button>
              </div>

              <div className="max-h-[420px] overflow-y-auto rounded-lg border border-[#1F2937] bg-[#0B0F14] p-4 text-sm leading-7 text-[#9CA3AF]">
                {feedback.split('\n').map((paragraph, index) =>
                  paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />,
                )}
              </div>

              <div className="mt-5 flex flex-wrap justify-end gap-3">
                {!isFollowUp && (
                  <button
                    onClick={handleGenerateFollowUp}
                    className="h-10 rounded-lg border border-[#1F2937] px-4 text-sm font-medium text-[#F9FAFB] transition-all duration-200 ease-out hover:border-white"
                  >
                    Generate Follow-up Step
                  </button>
                )}
                <button
                  onClick={() => onComplete(initialMission.id)}
                  className="h-10 rounded-lg bg-white px-4 text-sm font-medium text-black transition-all duration-200 ease-out hover:bg-zinc-200"
                >
                  Mark Step Complete
                </button>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default MissionView;
