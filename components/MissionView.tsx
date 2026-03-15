import React, { useState } from 'react';
import { Mission } from '../types';
import { geminiService } from '../services/geminiService';
import { mediaService } from '../services/mediaService';

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
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [isGeneratingMedia, setIsGeneratingMedia] = useState(false);
  const [isGeneratingFollowUp, setIsGeneratingFollowUp] = useState(false);
  const [isFollowUp, setIsFollowUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMediaInit = async () => {
    setIsGeneratingMedia(true);
    setError(null);

    try {
      const extraContext =
        currentMission.id === 's1'
          ? 'Show a computer screen with a list of user details. Include visible text labels such as GUESSED INTERESTS and PREDICTED MOOD.'
          : '';
      const prompt = `Educational project evidence: ${currentMission.scenario}. ${extraContext} Clear text details, neutral lighting, realistic context.`;

      let url = '';
      if (currentMission.mediaType === 'IMAGE') {
        url = await mediaService.generateImage(prompt);
      } else if (currentMission.mediaType === 'VIDEO') {
        url = await mediaService.generateVideo(prompt);
      }

      setMediaUrl(url);
    } catch (err) {
      setError('Unable to generate the project evidence preview. Please try again.');
      console.error(err);
    } finally {
      setIsGeneratingMedia(false);
    }
  };

  const handleSubmit = async () => {
    if (!response.trim()) return;

    setIsSubmitting(true);
    const imageData = currentMission.mediaType === 'IMAGE' && mediaUrl ? mediaUrl : undefined;

    const feedbackText = await geminiService.getMentorFeedback(
      `PROJECT CONTEXT: ${currentMission.scenario}\nPROJECT TASK: ${currentMission.task}`,
      response,
      imageData,
    );

    setFeedback(feedbackText);
    setIsSubmitting(false);
  };

  const handleGenerateFollowUp = async () => {
    if (!feedback) return;

    setIsGeneratingFollowUp(true);
    try {
      const followUp = await geminiService.generateSimilarMission(currentMission, response, feedback);
      setCurrentMission(followUp);
      setIsFollowUp(true);
      setResponse('');
      setFeedback(null);
      setMediaUrl(null);
    } catch (err) {
      setError('Unable to generate a follow-up project step.');
    } finally {
      setIsGeneratingFollowUp(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#F9FAFB]">
      <div className="mx-auto grid min-h-screen max-w-[1400px] grid-cols-1 md:grid-cols-[360px_1fr]">
        <aside className="border-b border-[#1F2937] bg-[#111827] p-6 md:border-b-0 md:border-r md:p-8">
          <button
            onClick={onExit}
            className="mb-6 h-10 rounded-lg border border-[#1F2937] px-4 text-sm font-medium text-[#9CA3AF] transition-all duration-200 ease-out hover:border-[#4F46E5] hover:text-[#F9FAFB]"
          >
            Back to Dashboard
          </button>

          <p className="text-sm text-[#9CA3AF]">Project Step</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#F9FAFB]">{currentMission.title}</h1>
          <p className="mt-3 text-sm text-[#9CA3AF]">{currentMission.description}</p>

          <div className="mt-6 space-y-4">
            <section className="rounded-xl border border-[#1F2937] bg-[#0B0F14] p-4">
              <h2 className="text-sm font-medium text-[#F9FAFB]">Challenge</h2>
              <p className="mt-2 text-sm text-[#9CA3AF]">{currentMission.scenario}</p>
            </section>

            <section className="rounded-xl border border-[#1F2937] bg-[#0B0F14] p-4">
              <h2 className="text-sm font-medium text-[#F9FAFB]">Project Objective</h2>
              <p className="mt-2 text-sm text-[#9CA3AF]">{currentMission.task}</p>
            </section>

            <section className="rounded-xl border border-[#1F2937] bg-[#0B0F14] p-4">
              <h2 className="text-sm font-medium text-[#F9FAFB]">Structured Output Checklist</h2>
              <ul className="mt-2 space-y-2 text-sm text-[#9CA3AF]">
                <li>1. Explain the concept clearly.</li>
                <li>2. Apply a practical method or framework.</li>
                <li>3. Produce a portfolio-ready output.</li>
                <li>4. Reflect on limitations and improvements.</li>
              </ul>
            </section>

            {isFollowUp && (
              <section className="rounded-xl border border-indigo-500/40 bg-indigo-500/10 p-4">
                <p className="text-sm text-indigo-200">Follow-up step generated to deepen your project analysis.</p>
              </section>
            )}
          </div>
        </aside>

        <main className="relative p-6 md:p-8">
          {isGeneratingFollowUp && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0B0F14]/90">
              <div className="rounded-xl border border-[#1F2937] bg-[#111827] px-6 py-5 text-sm text-[#9CA3AF]">
                Generating follow-up project step...
              </div>
            </div>
          )}

          {currentMission.mediaType !== 'TEXT' && !mediaUrl && !feedback && (
            <section className="mb-6 rounded-xl border border-[#1F2937] bg-[#111827] p-6 text-center">
              {isGeneratingMedia ? (
                <p className="text-sm text-[#9CA3AF]">Preparing evidence preview...</p>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-[#F9FAFB]">Evidence Preview</h2>
                  <p className="mt-2 text-sm text-[#9CA3AF]">
                    This project includes visual evidence. Generate it to analyze details before writing your response.
                  </p>
                  {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
                  <button
                    onClick={handleMediaInit}
                    className="mt-4 h-10 rounded-lg bg-[#4F46E5] px-4 text-sm font-medium text-[#F9FAFB] transition-all duration-200 ease-out hover:bg-indigo-500"
                  >
                    Generate Evidence
                  </button>
                </>
              )}
            </section>
          )}

          {mediaUrl && !feedback && (
            <section className="mb-6 overflow-hidden rounded-xl border border-[#1F2937] bg-[#111827]">
              {currentMission.mediaType === 'IMAGE' ? (
                <img src={mediaUrl} alt="Project evidence" className="max-h-[520px] w-full object-contain" />
              ) : (
                <video src={mediaUrl} controls autoPlay loop className="max-h-[520px] w-full" />
              )}
              <div className="border-t border-[#1F2937] px-4 py-3 text-sm text-[#9CA3AF]">Evidence node: {currentMission.id}</div>
            </section>
          )}

          {!feedback ? (
            <section className="rounded-xl border border-[#1F2937] bg-[#111827] p-6">
              <h2 className="text-xl font-semibold text-[#F9FAFB]">Write Your Structured Response</h2>
              <p className="mt-2 text-sm text-[#9CA3AF]">
                Use the template format so your work is ready to become a portfolio artifact.
              </p>

              <textarea
                className="mt-4 min-h-[260px] w-full rounded-lg border border-[#1F2937] bg-[#0B0F14] p-4 text-sm text-[#F9FAFB] outline-none transition-all duration-200 ease-out placeholder:text-[#6B7280] focus:border-[#4F46E5]"
                placeholder={'Concept\n-\n\nMethod\n-\n\nOutput\n-\n\nReflection\n-'}
                value={response}
                onChange={(event) => setResponse(event.target.value)}
              />

              <div className="mt-4 flex justify-end">
                <button
                  disabled={isSubmitting || !response.trim() || (currentMission.mediaType !== 'TEXT' && !mediaUrl)}
                  onClick={handleSubmit}
                  className="h-10 rounded-lg bg-[#4F46E5] px-5 text-sm font-medium text-[#F9FAFB] transition-all duration-200 ease-out hover:bg-indigo-500 disabled:opacity-50"
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
                  className="h-9 rounded-lg border border-[#1F2937] px-3 text-sm font-medium text-[#9CA3AF] transition-all duration-200 ease-out hover:border-[#4F46E5] hover:text-[#F9FAFB]"
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
                    className="h-10 rounded-lg border border-[#1F2937] px-4 text-sm font-medium text-[#F9FAFB] transition-all duration-200 ease-out hover:border-[#4F46E5]"
                  >
                    Generate Follow-up Step
                  </button>
                )}
                <button
                  onClick={() => onComplete(initialMission.id)}
                  className="h-10 rounded-lg bg-[#4F46E5] px-4 text-sm font-medium text-[#F9FAFB] transition-all duration-200 ease-out hover:bg-indigo-500"
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
