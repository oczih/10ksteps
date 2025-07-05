import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

interface ChangePaceProps {
  handleSliderChange: (event: Event, value: number | number[]) => void;
  handlePaceChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  pace: number;
}

export default function ChangePace({ handleSliderChange, handlePaceChange, pace }: ChangePaceProps) {
    return (
        <Box className="w-full" sx={{ width: '100%' }}>
            <Typography id="input-slider" gutterBottom className="text-sm sm:text-base font-semibold text-white mb-3">
                Pace: {pace} km/h
            </Typography>
            <Slider
                aria-label="Pace"
                value={pace}
                onChange={handleSliderChange}
                valueLabelDisplay="auto"
                step={0.1}
                min={1}
                max={10}
                sx={{ 
                    width: '100%',
                    height: 8,
                    '& .MuiSlider-track': {
                        backgroundColor: '#8b5cf6',
                        border: 'none',
                        height: 8,
                    },
                    '& .MuiSlider-thumb': {
                        backgroundColor: '#8b5cf6',
                        border: '2px solid #ffffff',
                        width: 24,
                        height: 24,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                        '&:hover, &.Mui-focusVisible': {
                            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                            transform: 'scale(1.1)',
                        },
                    },
                    '& .MuiSlider-rail': {
                        backgroundColor: '#374151',
                        height: 8,
                        borderRadius: 4,
                    },
                    '& .MuiSlider-valueLabel': {
                        backgroundColor: '#8b5cf6',
                        color: '#ffffff',
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                    }
                }}
            />

            {/* Alternative pace selector */}
            <div className="mt-4">
                <label className="label">
                    <span className="label-text font-medium text-xs sm:text-sm text-white">Quick Pace Selection</span>
                </label>
                <select 
                    className="select select-bordered w-full select-sm sm:select-md text-xs sm:text-sm bg-[#374151] text-white border-[#4a5568] focus:border-yellow-400" 
                    value={pace}
                    onChange={handlePaceChange}
                >
                    <option value={3}>Slow Walk (3 km/h)</option>
                    <option value={4}>Leisurely Walk (4 km/h)</option>
                    <option value={5}>Normal Walk (5 km/h)</option>
                    <option value={6}>Brisk Walk (6 km/h)</option>
                    <option value={7}>Fast Walk (7 km/h)</option>
                    <option value={8}>Power Walk (8 km/h)</option>
                </select>
            </div>
        </Box>
    );
}